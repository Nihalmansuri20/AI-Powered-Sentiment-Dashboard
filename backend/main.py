from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from textblob import TextBlob
import pandas as pd
import jwt
from datetime import datetime, timedelta
import io

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-powered-sentiment-dashboard-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT config
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory user DB
users_db = {}

# -------------------------------
# Auth & Registration Endpoints
# -------------------------------
class RegisterForm(BaseModel):
    username: str
    password: str

@app.post("/register")
async def register(user: RegisterForm):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[user.username] = {"username": user.username, "password": user.password}
    return {"message": "User registered successfully"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or form_data.password != user["password"]:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------------------
# Sentiment Analysis Logic
# -------------------------------
def analyze_sentiment(text):
    analysis = TextBlob(str(text))
    if analysis.sentiment.polarity > 0:
        return "positive"
    elif analysis.sentiment.polarity < 0:
        return "negative"
    return "neutral"

# in main.py
@app.get("/", include_in_schema=False)
def root():
    return {"status": "ok", "service": "sentiment-api"}

@app.get("/health", include_in_schema=False)
def health():
    return {"ok": True}

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    try:
        # Load file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=",", engine="python")
        
        # Try to detect feedback/review column
        text_column = None
        possible_names = ["text", "review", "feedback", "comment", "message", "content", "body"]
        for col in df.columns:
            if col.strip().lower() in possible_names:
                text_column = col
                break

        if not text_column:
            raise HTTPException(status_code=400, detail="No feedback/review column found.")

        # Detect optional columns
        id_column = next((col for col in df.columns if 'id' in col.lower()), None)
        time_column = next((col for col in df.columns if 'time' in col.lower() or 'date' in col.lower()), None)

        # Perform analysis
        results = []
        for i, row in df.iterrows():
            sentiment = analyze_sentiment(row[text_column])
            results.append({
                "id": row[id_column] if id_column and id_column in row else i + 1,
                "text": row[text_column],
                "sentiment": sentiment,
                "timestamp": row[time_column] if time_column and time_column in row else None
            })

        sentiment_counts = {
            "positive": sum(r["sentiment"] == "positive" for r in results),
            "neutral": sum(r["sentiment"] == "neutral" for r in results),
            "negative": sum(r["sentiment"] == "negative" for r in results),
        }

        return {"results": results, "statistics": sentiment_counts}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing file: {str(e)}")
