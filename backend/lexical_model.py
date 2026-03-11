import re
from urllib.parse import urlparse
import joblib
import numpy as np

def extract_features(url):
    """
    Extracts lexical features from a URL.
    """
    hostname = urlparse(url).hostname or ""
    path = urlparse(url).path or ""
    
    features = {
        'url_length': len(url),
        'num_dots': url.count('.'),
        'num_special_chars': len(re.findall(r'[@?&=_-]', url)),
        'has_https': 1 if url.startswith('https') else 0,
        'suspicious_keywords': 1 if any(kw in url.lower() for kw in ['login', 'verify', 'bank', 'secure', 'account', 'update']) else 0,
        'domain_length': len(hostname),
        'num_subdomains': hostname.count('.') - 1 if hostname.count('.') > 1 else 0
    }
    
    # Convert to list for model input
    return list(features.values())

def predict_url(url):
    """
    Predicts if a URL is phishing using the Random Forest model.
    """
    # In a real app, you would load the model:
    # model = joblib.load('models/random_forest_model.pkl')
    # features = np.array(extract_features(url)).reshape(1, -1)
    # prediction = model.predict(features)[0]
    # probability = model.predict_proba(features)[0][1]
    
    # Mock prediction for demonstration
    features = extract_features(url)
    score = (features[0]/200 + features[1]/5 + features[2]/5 + (1-features[3]) + features[4]) / 5
    probability = min(max(score, 0.1), 0.95)
    
    return {
        'url': url,
        'prediction': 'Phishing' if probability > 0.5 else 'Legitimate',
        'probability': round(probability * 100, 2),
        'features': {
            'length': features[0],
            'dots': features[1],
            'special_chars': features[2],
            'https': bool(features[3]),
            'suspicious': bool(features[4])
        }
    }
