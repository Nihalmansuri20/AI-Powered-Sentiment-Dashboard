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

## Installation

### Prerequisites
- Python 3.9+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Create a virtual environment:
    ```sh
    python -m venv venv
    ```
3. Activate the virtual environment:
    - On Windows:
      ```sh
      venv\Scripts\activate
      ```
    - On macOS/Linux:
      ```sh
      source venv/bin/activate
      ```
4. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install the required dependencies using npm or yarn:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

## Running the Application

### Start Backend Server
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Start the backend server:
    ```sh
    uvicorn main:app --reload
    ```

### Start Frontend Server
1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Start the frontend server:
    ```sh
    npm start
    ```
    or
    ```sh
    yarn start
    ```
