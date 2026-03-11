def combine_predictions(lexical_res, visual_res):
    """
    Combines lexical and visual predictions using a weighted average.
    """
    lexical_prob = lexical_res['probability'] / 100
    visual_prob = visual_res['visual_probability'] / 100
    
    # Weights: Lexical (0.4), Visual (0.6) - Visual is often more robust for zero-day
    weight_lexical = 0.4
    weight_visual = 0.6
    
    hybrid_prob = (lexical_prob * weight_lexical) + (visual_prob * weight_visual)
    
    return {
        'url': lexical_res['url'],
        'lexical_analysis': lexical_res,
        'visual_analysis': visual_res,
        'hybrid_prediction': 'Phishing' if hybrid_prob > 0.5 else 'Legitimate',
        'risk_score': round(hybrid_prob * 100, 2),
        'status': 'Danger' if hybrid_prob > 0.7 else 'Warning' if hybrid_prob > 0.4 else 'Safe'
    }
