# 🧠 AI-Powered Sentiment Dashboard

A clean and responsive full-stack web app designed to detect and visualize sentiments from uploaded CSV files using Natural Language Processing (NLP).

## ✨ Highlights

- JWT-secured user authentication
- Upload any CSV file and get instant sentiment analysis
- Clear and responsive chart-based insights
- Sleek UI with subtle animations
- Drag-and-drop file support
- Works seamlessly on desktops, tablets, and mobiles
- Summary dashboard with helpful sentiment metrics

## 💻 Technologies Used

### Frontend
- React.js (UI development)
- Chart.js (graphs and charts)
- Axios (handling API requests)
- React Router DOM (routing)
- CSS3 transitions and effects

### Backend
- FastAPI (Python backend framework)
- TextBlob (sentiment processing)
- Pandas (CSV and data wrangling)
- JSON Web Tokens (JWT auth)
- python-multipart, CORS setup

## 🗂️ Folder Overview

```
AI-Sentiment-Analysis-Dashboard/
│
├── frontend/        # React UI
├── backend/         # FastAPI services
│   ├── main.py      # App entry point
│   └── auth.py      # Auth routes
└── requirements.txt # Backend dependencies
```

## ⚙️ Setup Instructions

### Requirements

- Python 3.10
- Node.js (v14 or above)
- npm or yarn (whichever you prefer)

---

### 🚀 Backend Setup

1. Open your terminal and move to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate it:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

---

### 💻 Frontend Setup

1. Open another terminal window, go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install all packages:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Launch the React app:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

---

## 📊 Sample CSV Format

To test this app, use a CSV file with at least one column named `feedback` or `text`. Example:

| id | feedback                          |
|----|-----------------------------------|
| 1  | Loved the product, highly recommend! |
| 2  | Not satisfied, expected better.   |

You can also try your own dataset with text reviews or opinions.

---

## 📘 Notes

- This is a student project built for educational purposes.
- Developed by Nihal Mansuri.
- You can fork or extend it for your own use cases like customer support, reviews dashboard, etc.

---
