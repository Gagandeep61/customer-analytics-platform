# ml_models.py
# Loads all saved ML models when the API starts up

import joblib
import os

class MLModels:
    """
    Loads and holds all ML models.
    Created once at startup, shared across all API requests.
    """

    def __init__(self):
        # Path to where models are saved
        # When running locally: saved_models/ is in backend/
        base = os.path.join(os.path.dirname(__file__), '..', 'saved_models')

        print("Loading models...")

        # --- Clustering models (for /segment endpoint) ---
        self.kmeans  = joblib.load(os.path.join(base, 'kmeans_model.pkl'))
        self.scaler  = joblib.load(os.path.join(base, 'clustering_scaler.pkl'))
        self.cluster_profiles = joblib.load(os.path.join(base, 'cluster_profiles.pkl'))
        self.segment_map      = joblib.load(os.path.join(base, 'segment_map.pkl'))

        # --- Churn prediction models (for /predict-churn endpoint) ---
        self.churn_models = {
            'xgboost':  joblib.load(os.path.join(base, 'xgboost.pkl')),
            'logistic': joblib.load(os.path.join(base, 'logistic_regression.pkl')),
            'ridge':    joblib.load(os.path.join(base, 'ridge_classifier.pkl')),
            'lasso':    joblib.load(os.path.join(base, 'lasso.pkl')),
            'knn':      joblib.load(os.path.join(base, 'knn.pkl')),
            'naive_bayes': joblib.load(os.path.join(base, 'naive_bayes.pkl')),
        }

        # Feature names used during training (for churn models)
        self.feature_names = joblib.load(os.path.join(base, 'feature_names.pkl'))

        print(f"✓ Clustering model loaded")
        print(f"✓ {len(self.churn_models)} churn models loaded")
        print(f"✓ Features: {self.feature_names}")
        print("All models ready!")
