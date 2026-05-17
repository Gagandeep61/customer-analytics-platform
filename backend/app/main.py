# Triggering automated CI/CD pipeline deployment for API
# # main.py
# The FastAPI application — all endpoints live here

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from .ml_models import MLModels
from .models import ChurnRequest, ChurnResponse, SegmentRequest, SegmentResponse
from .utils import get_risk_level, generate_recommendation, calculate_roi

# ─────────────────────────────────────────
# Setup logging
# ─────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────
# Create the FastAPI app
# ─────────────────────────────────────────
app = FastAPI(
    title="Customer Analytics API",
    description="Predicts customer churn and identifies customer segments",
    version="1.0.0"
)

# Allow frontend (Vercel) to call this API
# Without this, the browser blocks cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Later restrict to your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all models ONCE when the API starts
# This runs only one time — not per request
ml = MLModels()

# ─────────────────────────────────────────
# ENDPOINT 1: Health Check
# GET /
# ─────────────────────────────────────────
@app.get("/")
def health_check():
    """
    Simple check to confirm the API is running.
    Called by frontend to verify backend is alive.
    """
    return {
        "status":        "healthy",
        "models_loaded": len(ml.churn_models),
        "version":       "1.0.0",
        "endpoints":     ["/predict-churn", "/segment", "/models/compare"]
    }

# ─────────────────────────────────────────
# ENDPOINT 2: Churn Prediction
# POST /predict-churn
# ─────────────────────────────────────────
@app.post("/predict-churn", response_model=ChurnResponse)
def predict_churn(request: ChurnRequest):
    """
    Predicts whether a customer will churn.
    
    Accepts customer features, returns:
    - churn probability (0 to 1)
    - risk level (Low / Medium / High)
    - business recommendation
    - ROI calculation for retention effort
    """
    logger.info(f"Churn prediction request — model: {request.model_choice}")

    try:
        # Step 1: Validate model choice
        valid_models = list(ml.churn_models.keys())
        if request.model_choice not in valid_models:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid model. Choose from: {valid_models}"
            )

        # Step 2: Build feature array in the same order as training
        # Order must match feature_names saved in Phase 4
        features = np.array([[
            request.frequency,
            request.monetary,
            request.cluster,
            request.aov,
            request.tenure,
            request.product_diversity,
            request.return_rate
        ]])

        # Step 3: Get the selected model and predict
        model = ml.churn_models[request.model_choice]

        if hasattr(model, 'predict_proba'):
            # Most models: get probability of churn (class 1)
            churn_prob = float(model.predict_proba(features)[0][1])
        else:
            # Ridge doesn't have predict_proba — use decision function
            score = model.decision_function(features)[0]
            # Convert to 0-1 range using sigmoid
            churn_prob = float(1 / (1 + np.exp(-score)))

        # Step 4: Get segment name for recommendation
        segment_name = ml.segment_map.get(request.cluster, "Unknown")

        # Step 5: Generate outputs
        risk_level     = get_risk_level(churn_prob)
        recommendation = generate_recommendation(churn_prob, segment_name)
        roi            = calculate_roi(churn_prob, request.monetary)

        logger.info(f"Prediction complete — probability: {churn_prob:.3f}, risk: {risk_level}")

        return ChurnResponse(
            churn_probability = round(churn_prob, 4),
            risk_level        = risk_level,
            recommendation    = recommendation,
            roi_calculation   = roi,
            model_used        = request.model_choice
        )

    except HTTPException:
        raise    # Re-raise HTTP errors as-is

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 3: Customer Segmentation
# POST /segment
# ─────────────────────────────────────────
@app.post("/segment", response_model=SegmentResponse)
def segment_customer(request: SegmentRequest):
    """
    Assigns a customer to one of 4 segments:
    VIP, Loyal, New, At-Risk

    Uses the K-Means model trained in Phase 2.
    """
    logger.info("Segmentation request received")

    try:
        # Step 1: Build feature array (same order as clustering training)
        features = np.array([[
    request.frequency,
    request.monetary,
    request.aov,
    request.product_diversity
]])
        
        # Step 2: Scale features (KMeans needs scaled input)
        features_scaled = ml.scaler.transform(features)

        # Step 3: Predict cluster
        cluster_id = int(ml.kmeans.predict(features_scaled)[0])

        # Step 4: Get segment name
        segment_name = ml.segment_map.get(cluster_id, "Unknown")

        # Step 5: Get average profile for this cluster
        cluster_profile = {
            k: v.get(segment_name, 0)
            for k, v in ml.cluster_profiles.items()
        }

        logger.info(f"Segment assigned: {segment_name} (cluster {cluster_id})")

        return SegmentResponse(
            cluster_id      = cluster_id,
            segment_name    = segment_name,
            cluster_profile = cluster_profile
        )

    except Exception as e:
        logger.error(f"Segmentation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Segmentation failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 4: Model Comparison
# GET /models/compare
# ─────────────────────────────────────────
@app.get("/models/compare")
def compare_models():
    """
    Returns the performance metrics for all 6 trained models.
    Hardcoded from model evaluation results.
    """
    return {
    "models": [
        {
            "name":      "XGBoost",
            "accuracy":  0.706,
            "precision": 0.560,
            "recall":    0.797,
            "f1":        0.658,
            "auc":       0.798,
            "time_s":    1.82,
            "best_for":  "Highest AUC — best at separating churned vs active"
        },
        {
            "name":      "Lasso (L1)",
            "accuracy":  0.714,
            "precision": 0.571,
            "recall":    0.769,
            "f1":        0.656,
            "auc":       0.791,
            "time_s":    0.01,
            "best_for":  "Best accuracy — automatic feature selection via L1 regularization"
        },
        {
            "name":      "Logistic Regression",
            "accuracy":  0.712,
            "precision": 0.570,
            "recall":    0.765,
            "f1":        0.653,
            "auc":       0.791,
            "time_s":    0.02,
            "best_for":  "Most interpretable — easy to explain to stakeholders"
        },
        {
            "name":      "Ridge Classifier",
            "accuracy":  0.707,
            "precision": 0.563,
            "recall":    0.779,
            "f1":        0.654,
            "auc":       0.789,
            "time_s":    0.02,
            "best_for":  "Fast and stable — good balance of speed and accuracy"
        },
        {
            "name":      "Naive Bayes",
            "accuracy":  0.702,
            "precision": 0.554,
            "recall":    0.819,
            "f1":        0.661,
            "auc":       0.794,
            "time_s":    0.01,
            "best_for":  "Highest recall (81.9%) — catches almost every churner"
        },
        {
            "name":      "KNN",
            "accuracy":  0.696,
            "precision": 0.591,
            "recall":    0.463,
            "f1":        0.519,
            "auc":       0.734,
            "time_s":    0.01,
            "best_for":  "Highest precision — very few false alarms"
        }
    ],
    "best_auc_model":  "XGBoost",
    "best_f1_model":   "Naive Bayes",
    "fastest_model":   "KNN",
    "recommendation":  "Use XGBoost for best AUC. Use Naive Bayes to catch the most churners."
}
