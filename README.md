# Zero-Day Phishing Detection Using Hybrid Visual and Lexical Analysis

This project implements a cybersecurity system designed to detect phishing websites by combining URL lexical features with visual analysis of the webpage.

## Features
- **Lexical Analysis**: Uses a Random Forest model to analyze URL structure (length, dots, special characters, etc.).
- **Visual Analysis**: Uses a Convolutional Neural Network (CNN) to analyze the visual appearance of the webpage.
- **Hybrid Detection**: Combines both models for a more accurate risk assessment.
- **Modern Dashboard**: A clean, responsive UI for scanning URLs.

## Project Structure
- `backend/`: Flask API and ML model logic.
- `src/`: React frontend (for the live preview).
- `python_backend/`: (Optional) Standalone Python backend for local use.

## Setup Instructions (Local)

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Frontend Setup
In a new terminal, install dependencies and start the React app:
```bash
npm install
npm run dev
```

## How it Works
1. **URL Input**: User enters a URL in the dashboard.
2. **Feature Extraction**: The backend extracts lexical features from the URL.
3. **Visual Capture**: The system captures a screenshot (simulated in this demo).
4. **ML Inference**: Both models process the data.
5. **Hybrid Score**: A weighted average determines the final risk percentage.

## Technologies Used
- **Frontend**: React, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Python, Flask, Scikit-Learn, TensorFlow/Keras.
- **AI**: Gemini API (used for the live preview's hybrid reasoning).
