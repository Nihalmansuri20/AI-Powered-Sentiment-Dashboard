from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from textblob import TextBlob
import pandas as pd
import jwt
from datetime import datetime, timedelta
import io

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database
users_db = {
    "admin": {
        "username": "admin",
        "password": "admin123"
    }
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or form_data.password != user["password"]:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return username

def analyze_sentiment(text):
    analysis = TextBlob(text)
    # Convert polarity to simple categories
    if analysis.sentiment.polarity > 0:
        return "positive"
    elif analysis.sentiment.polarity < 0:
        return "negative"
    return "neutral"

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate required columns
        if 'id' not in df.columns or 'text' not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'id' and 'text' columns")
        
        # Analyze sentiments
        results = []
        for _, row in df.iterrows():
            sentiment = analyze_sentiment(row['text'])
            results.append({
                'id': row['id'],
                'text': row['text'],
                'sentiment': sentiment,
                'timestamp': row.get('timestamp', None)
            })
        
        # Calculate statistics
        sentiment_counts = {
            'positive': len([r for r in results if r['sentiment'] == 'positive']),
            'negative': len([r for r in results if r['sentiment'] == 'negative']),
            'neutral': len([r for r in results if r['sentiment'] == 'neutral'])
        }
        
        return {
            'results': results,
            'statistics': sentiment_counts
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
