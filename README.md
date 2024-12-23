# Sentiment Analysis Dashboard 🎯

An interactive full-stack application that analyzes sentiment from CSV data and presents it through a modern dashboard interface.

## 🌟 Key Features

- Secure login system with JWT authentication
- Real-time sentiment analysis of CSV data
- Interactive data visualization with charts
- Modern UI with Matrix-style animations
- Drag-and-drop file upload
- Responsive design for all devices
- Statistical analysis dashboard

## 🛠️ Technology Stack

### Frontend
- React.js (UI framework)
- Chart.js (data visualization)
- Axios (API calls)
- React Router (navigation)
- Modern CSS3 animations

### Backend
- FastAPI (Python web framework)
- TextBlob (sentiment analysis)
- Pandas (data processing)
- JWT (authentication)
- CORS (security)

## 📂 Project Structure

## Installation

### Prerequisites
- Python 3.8+
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
