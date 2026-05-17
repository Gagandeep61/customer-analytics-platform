---
title: Customer Analytics API
emoji: 📊
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# Customer Analytics API

FastAPI backend for customer churn prediction and segmentation.

Built with: FastAPI · Scikit-learn · XGBoost · MLflow

## Endpoints
- `GET  /`                → Health check
- `POST /predict-churn`   → Predict customer churn (6 models)
- `POST /segment`         → Assign customer to segment
- `GET  /models/compare`  → Compare all 6 model metrics
