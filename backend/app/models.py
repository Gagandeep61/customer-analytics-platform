# models.py
# Defines the shape of data going IN and OUT of each endpoint

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Literal

# ─────────────────────────────────────────
# INPUT: What the user sends for churn prediction
# ─────────────────────────────────────────
class ChurnRequest(BaseModel):
    frequency:        int   = Field(...,  ge=1,   le=500,      description="Number of orders placed")
    monetary:         float = Field(...,  gt=0.0, le=300000.0, description="Total spend in £")
    aov:              float = Field(...,  gt=0.0, le=10000.0,  description="Average order value in £")
    tenure:           int   = Field(...,  ge=0,   le=373,      description="Days between first and last purchase")
    product_diversity:int   = Field(...,  ge=1,   le=4000,     description="Number of unique products bought")
    return_rate:      float = Field(...,  ge=0.0, le=1.0,      description="Fraction of returns (0 to 1)")
    cluster:          int   = Field(...,  ge=0,   le=3,        description="K-Means cluster (0-3)")
    model_choice: Literal[
    "xgboost", "knn", "logistic", "ridge", "lasso", "naive_bayes"
] = "xgboost"

    model_config = ConfigDict(
        protected_namespaces=(),
        json_schema_extra={
            "example": {
                "frequency": 8,
                "monetary": 1200.0,
                "aov": 150.0,
                "tenure": 180,
                "product_diversity": 12,
                "return_rate": 0.05,
                "cluster": 1,
                "model_choice": "xgboost"
            }
        }
    )

# ─────────────────────────────────────────
# OUTPUT: What the API returns for churn prediction
# ─────────────────────────────────────────

class ChurnResponse(BaseModel):
    churn_probability: float
    risk_level:        str          # "Low", "Medium", "High"
    recommendation:    str
    roi_calculation:   Dict
    model_used:        str

    model_config = ConfigDict(protected_namespaces=())

# ─────────────────────────────────────────
# INPUT: What the user sends for segmentation
# ─────────────────────────────────────────
class SegmentRequest(BaseModel):
    frequency:         int   = Field(..., ge=1,   le=500)
    monetary:          float = Field(..., gt=0.0, le=300000.0)
    aov:               float = Field(..., gt=0.0, le=10000.0)
    tenure:            int   = Field(..., ge=0,   le=373)
    product_diversity: int   = Field(..., ge=1,   le=4000)
    return_rate:       float = Field(..., ge=0.0, le=1.0)

    model_config = ConfigDict(   
        json_schema_extra={
            "example": {
                "frequency": 8,
                "monetary": 1200.0,
                "aov": 150.0,
                "tenure": 180,
                "product_diversity": 12,
                "return_rate": 0.05
            }
        }
    )

# ─────────────────────────────────────────
# OUTPUT: What the API returns for segmentation
# ─────────────────────────────────────────
class SegmentResponse(BaseModel):
    cluster_id:      int
    segment_name:    str
    cluster_profile: Dict
