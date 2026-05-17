---
title: Customer Analytics API
emoji: 📊
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# 🔧 Backend API — Customer Analytics Platform

**FastAPI server for ML model inference**

Exposes 4 endpoints for churn prediction, customer segmentation, and model comparison. Deployed to HuggingFace Spaces with Docker.

---

## 📍 Live API

**URL:** https://gagan61-customer-analytics-api.hf.space  
**Docs:** https://gagan61-customer-analytics-api.hf.space/docs  
**Status:** Check the green/red dot on the dashboard

---

## 🏗️ Architecture

```
Frontend (Vercel)
    ↓ HTTP POST/GET
FastAPI Server (HF Spaces)
    ↓
ML Models (6 .pkl files)
    ├─ XGBoost (best AUC)
    ├─ KNN (fastest)
    ├─ Logistic Regression
    ├─ Ridge Classifier
    ├─ Lasso (L1)
    └─ Naive Bayes
    ↓
Predictions + Recommendations
    ↑
Frontend
```

---

## 🚀 Local Development

### Setup

**1. Navigate to backend**
```bash
cd backend
```

**2. Create virtual environment**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Start the server**
```bash
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO: Loading models...
INFO: ✓ Clustering model loaded
INFO: ✓ 6 churn models loaded
INFO: ✓ Features: ['Frequency', 'Monetary', 'Cluster', 'AOV', 'Tenure', 'ProductDiversity', 'ReturnRate']
All models ready!
INFO: Uvicorn running on http://127.0.0.1:8000
```

**5. Test the API**

Open browser: http://localhost:8000/docs

You'll see the **Swagger UI** with all endpoints. Try the `/` endpoint → should return `{"status": "healthy", "models_loaded": 6}`

---

## 📡 API Endpoints

### 1. Health Check
```
GET /
```

**Purpose:** Check if API is running and models are loaded

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": 6
}
```

---

### 2. Predict Churn
```
POST /predict-churn
```

**Purpose:** Predict if a customer will churn

**Request Body:**
```json
{
  "frequency": 3,
  "monetary": 1000,
  "aov": 407,
  "tenure": 107,
  "product_diversity": 43,
  "return_rate": 0.02,
  "cluster": 2,
  "model_choice": "xgboost"
}
```

**Parameters:**
| Field | Type | Range | Example |
|-------|------|-------|---------|
| frequency | float | 1+ | 3 (orders) |
| monetary | float | 0+ | 1000 (£) |
| aov | float | 0+ | 407 (£) |
| tenure | int | 1+ | 107 (days) |
| product_diversity | int | 1+ | 43 (unique products) |
| return_rate | float | 0-1 | 0.02 (2%) |
| cluster | int | 0-3 | 2 (Loyal) |
| model_choice | string | See below | "xgboost" |

**model_choice options:**
- `xgboost` — Best AUC (0.980)
- `knn` — Best F1 & fastest (0.898, 0.01s)
- `logistic` — Logistic regression
- `ridge` — Ridge classifier
- `lasso` — Lasso (L1)
- `naive_bayes` — Naive Bayes

**Response:**
```json
{
  "churn_probability": 0.53,
  "risk_level": "Medium",
  "recommendation": "Loyal customer showing signs of disengagement — Offer bonus points or a thank-you discount.",
  "model_used": "xgboost",
  "roi_calculation": {
    "value_at_risk": 77,
    "expected_save": 12,
    "intervention_cost": 10,
    "roi": 0.2
  }
}
```

**Response Fields:**
- `churn_probability` — 0-1 (probability of churning)
- `risk_level` — "Low", "Medium", or "High"
- `recommendation` — Specific action to take
- `model_used` — Which model made the prediction
- `roi_calculation` — Business impact numbers

---

### 3. Customer Segmentation
```
POST /segment
```

**Purpose:** Determine which customer segment (cluster) a customer belongs to

**Request Body:**
```json
{
  "frequency": 3,
  "monetary": 1000,
  "aov": 407,
  "tenure": 107,
  "product_diversity": 43,
  "return_rate": 0.02,
  "recency": 84
}
```

**Parameters:**
| Field | Type | Range | Example |
|-------|------|-------|---------|
| frequency | float | 1+ | 3 (orders) |
| monetary | float | 0+ | 1000 (£) |
| aov | float | 0+ | 407 (£) |
| tenure | int | 1+ | 107 (days) |
| product_diversity | int | 1+ | 43 (unique products) |
| return_rate | float | 0-1 | 0.02 (2%) |
| recency | int | 0+ | 84 (days since last purchase) |

**Response:**
```json
{
  "cluster_id": 2,
  "segment_name": "Loyal",
  "cluster_profile": {
    "Frequency": 2.6,
    "Monetary": 1003.5,
    "AOV": 406.9,
    "Tenure": 107.3,
    "ProductDiversity": 42.8,
    "ReturnRate": 0.024
  }
}
```

**Segments:**
| Cluster | Name | Characteristics |
|---------|------|---|
| 0 | VIP | High spend (£3233), frequent (6.4 orders), loyal (191d tenure) |
| 1 | New | Low spend (£718), few orders (1.9), new (48d tenure) |
| 2 | Loyal | Medium spend (£1003), consistent (2.6 orders), established (107d tenure) |
| 3 | At-Risk | Low spend (£565), inactive (1.4 orders), very short tenure (8d) |

---

### 4. Model Comparison
```
GET /models/compare
```

**Purpose:** Get metrics for all 6 models

**Response:**
```json
{
  "models": [
    {
      "name": "XGBoost",
      "auc": 0.980,
      "f1": 0.907,
      "precision": 0.906,
      "recall": 0.908,
      "time_s": 0.05,
      "best_for": "Best overall accuracy"
    },
    {
      "name": "KNN (k=5)",
      "auc": 0.966,
      "f1": 0.898,
      "precision": 0.881,
      "recall": 0.917,
      "time_s": 0.01,
      "best_for": "Fastest + best F1"
    },
    ...
  ],
  "best_auc_model": "XGBoost"
}
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Package init
│   ├── main.py               # FastAPI app, CORS, endpoints
│   ├── ml_models.py          # MLModels class (load .pkl files)
│   ├── models.py             # Pydantic request/response schemas
│   └── utils.py              # ROI calculator, recommendations
│
├── saved_models/             # Pre-trained models
│   ├── xgboost.pkl
│   ├── knn.pkl
│   ├── logistic_regression.pkl
│   ├── ridge_classifier.pkl
│   ├── lasso.pkl
│   ├── naive_bayes.pkl
│   ├── feature_names.pkl
│   ├── kmeans_model.pkl      # For segmentation
│   ├── clustering_scaler.pkl
│   ├── cluster_profiles.pkl
│   └── segment_map.pkl
│
├── Dockerfile                # Docker container definition
├── requirements.txt          # Python dependencies
├── .dockerignore             # Files to exclude from Docker build
└── README.md                 # This file
```

---

## 🐳 Docker Deployment

### Build locally
```bash
docker build -t customer-analytics-api .
docker run -p 7860:7860 customer-analytics-api
```

Visit: http://localhost:7860/docs

### Deploy to HuggingFace Spaces

**Automatic (via GitHub Actions):**
1. Push to GitHub
2. CI/CD pipeline automatically builds Docker image
3. Uploads to HuggingFace Space
4. Takes ~2 minutes

**Manual (via Git):**
```bash
cd backend
git init
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/customer-analytics-api
git add .
git commit -m "Deploy"
git push origin main
```

---

## 🔧 Configuration

### CORS Settings
In `app/main.py`, CORS is enabled for all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all (or list specific domains)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

To restrict to specific frontend URL:
```python
allow_origins=["https://your-vercel-url.vercel.app"]
```

### Model Loading
In `app/ml_models.py`, models are loaded once at startup:
```python
class MLModels:
    def __init__(self):
        self.churn_models = {
            'xgboost': joblib.load('saved_models/xgboost.pkl'),
            'knn': joblib.load('saved_models/knn.pkl'),
            ...
        }
```

This means models are cached in memory (fast) but you must restart the server to load updated models.

---

## 🧪 Testing Endpoints

### Using curl
```bash
# Health check
curl http://localhost:8000/

# Predict churn
curl -X POST http://localhost:8000/predict-churn \
  -H "Content-Type: application/json" \
  -d '{"frequency": 3, "monetary": 1000, ...}'

# Segment
curl -X POST http://localhost:8000/segment \
  -H "Content-Type: application/json" \
  -d '{"frequency": 3, "monetary": 1000, ...}'

# Models
curl http://localhost:8000/models/compare
```

### Using Python
```python
import requests

# Predict
response = requests.post(
    'http://localhost:8000/predict-churn',
    json={
        'frequency': 3,
        'monetary': 1000,
        'aov': 407,
        'tenure': 107,
        'product_diversity': 43,
        'return_rate': 0.02,
        'cluster': 2,
        'model_choice': 'xgboost'
    }
)
print(response.json())
```

---

## 🐛 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| "Model not found" | .pkl file missing | Check `saved_models/` folder exists |
| "Feature shape mismatch" | Wrong number of features | Retrain models with correct features |
| CORS error | Frontend can't call API | Check `allow_origins` in main.py |
| "Connection refused" | API not running | Start with `uvicorn app.main:app --reload` |
| Slow responses | Cold start on HF | First request takes 15s (free tier) |
| Old predictions | Models not reloaded | Restart server: `Ctrl+C` then run again |

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Model load time | 2-3 seconds |
| Churn prediction | 50ms average |
| Segmentation | 20ms average |
| API response | <200ms |
| Cold start (HF) | 15s (free tier) |
| Warm requests | <1s |

---

## 🚢 Production Checklist

- [x] All 6 models saved and tested
- [x] CORS enabled for frontend domain
- [x] Feature names saved and validated
- [x] Docker image builds successfully
- [x] GitHub Actions CI/CD pipeline configured
- [x] Deployed to HuggingFace Spaces
- [x] API docs accessible at `/docs`
- [x] Health check endpoint working
- [x] Error handling in place
- [x] Logging configured

---

## 📈 Future Improvements

1. **Batch predictions** — `/predict-batch` endpoint for bulk processing
2. **Model retraining** — Automated retraining pipeline with new data
3. **A/B testing** — Compare model versions in production
4. **Feature importance** — Return top 3 churn drivers per prediction
5. **Caching** — Cache frequent predictions for speed
6. **Rate limiting** — Prevent abuse of free API

---

## 📞 Support

- Check `/docs` endpoint for interactive API documentation
- Review error messages in logs (visible in HuggingFace Space)
- Check the `app/main.py` for detailed code comments

---

**Deployed:** May 2026  
**Framework:** FastAPI 0.115.0  
**Python:** 3.11  
**Status:** Live on HuggingFace Spaces ✅
