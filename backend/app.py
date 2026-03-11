import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from lexical_model import extract_features, predict_url
from cnn_model import predict_visual
from hybrid_detector import combine_predictions

app = Flask(__name__)
CORS(app)

# Load the lexical model (Random Forest)
# In a real scenario, you'd train this first.
# For this template, we assume the model exists in models/
MODEL_PATH = 'models/random_forest_model.pkl'

@app.route('/predict-url', methods=['POST'])
def predict_lexical():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    result = predict_url(url)
    return jsonify(result)

@app.route('/predict-visual', methods=['POST'])
def predict_cnn():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    # In a real app, you'd use Selenium or Playwright to capture a screenshot here
    # screenshot_path = capture_screenshot(url)
    result = predict_visual(url)
    return jsonify(result)

@app.route('/predict-hybrid', methods=['POST'])
def predict_hybrid_route():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    lexical_res = predict_url(url)
    visual_res = predict_visual(url)
    
    final_result = combine_predictions(lexical_res, visual_res)
    return jsonify(final_result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
