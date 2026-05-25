# 🎯 Customer Analytics Platform
 
**ML-Powered Churn Prediction & Customer Segmentation for Marketing & CRM Teams**
 
> A Marketing Manager shouldn't need to write SQL to know which customers are about to leave. This platform bridges that gap — input customer metrics, get instant retention strategies.
 
![AUC](https://img.shields.io/badge/XGBoost%20AUC-79.8%25-brightgreen) ![Models](https://img.shields.io/badge/Models%20Trained-6-blue) ![Status](https://img.shields.io/badge/Status-Live-success) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-orange) ![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
 
---
 
## 🚀 Live Demo
 
- **Dashboard:** https://customer-analytics-platform-one.vercel.app
- **API Docs:** https://gagan61-customer-analytics-api.hf.space/docs
- **GitHub:** https://github.com/Gagandeep61/customer-analytics-platform
---
 
## ⚡ 30-Second Pitch
 
Built a full-stack ML platform that processes 500K+ retail transactions into actionable customer intelligence. The system segments 4,338 customers into four behavioural personas, predicts which will churn in the next 90 days with 79.8% AUC, and surfaces specific retention recommendations — all through a live API and dashboard requiring zero SQL or Python from the end user. The most technically significant achievement was identifying and fixing a data leakage issue that was artificially inflating model AUC from a realistic 79.8% to a misleading 97.8%.
 
---
 
## 📊 Quick Stats
 
| Metric | Value |
|--------|-------|
| Raw transactions processed | 541,909 rows |
| Customers profiled | 4,338 |
| ML models trained & compared | 6 |
| Best model AUC | 0.798 (XGBoost) |
| Best model Recall | 81.9% (Naive Bayes) |
| At-Risk customers identified | ~2,429 (56% of base) |
| Quarterly revenue protected* | ~£29,000 |
| API response time | < 50ms |
| Churn threshold | 90 days (industry standard) |
| Train / Test split | 3,170 / 1,168 customers |
 
*Assumes 5% win-back conversion rate on At-Risk segment at £240 avg AOV
 
---
 
## 🖥️ Dashboard Gallery
 
<details>
<summary>📊 Click to view Churn Prediction Tab</summary>
![Churn Analytics](images/churn-image.png)
</details>
<details>
<summary>👥 Click to view Customer Segmentation Tab</summary>
![Customer Segments](images/segment-image.png)
</details>
<details>
<summary>🤖 Click to view Model Comparison Tab</summary>
![Model Comparison](images/model-comparison-image.png)
</details>
---
 
## 📁 Project Structure
 
```
customer-analytic-platform/
│
├── 📊 data/
│   ├── Online Retail.xlsx          # Raw UCI dataset (541K transactions)
│   ├── cleaned_transactions.csv    # After Phase 1 cleaning
│   ├── rfm_segments.csv            # RFM + cluster assignments
│   ├── customer_features.csv       # All engineered features
│   ├── train_set.csv               # 80% split (3,170 customers)
│   └── test_set.csv                # 20% split (1,168 customers)
│
├── 📓 notebooks/
│   ├── data_cleaning.ipynb         # Phase 1: Raw → clean transactions
│   ├── segmentation.ipynb          # Phase 2-3: RFM, clustering, features, churn label
│   └── model.ipynb                 # Phase 4-5: Training, evaluation, saving
│
├── 🔧 backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, 4 endpoints
│   │   ├── ml_models.py            # Model loading at startup
│   │   ├── models.py               # Pydantic schemas + input validation
│   │   └── utils.py                # Risk levels, recommendations, ROI calc
│   ├── saved_models/               # 6 .pkl files + feature_names, segment_map
│   ├── Dockerfile
│   └── requirements.txt
│
├── 🎨 frontend/
│   ├── index.html
│   ├── style.css                   # Tailwind + custom dark theme
│   ├── script.js                   # API calls, validation, Chart.js
│   └── vercel.json
│
└── 📖 README.md
```
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology | Why |
|-------|-----------|-----|
| **Data** | Pandas, NumPy | Data cleaning & feature engineering |
| **ML** | Scikit-learn, XGBoost | 6 models trained & compared |
| **Backend** | FastAPI, Pydantic | Auto-generated docs, strict input validation |
| **Containerisation** | Docker | Reproducible environment, eliminates version drift |
| **Frontend** | HTML/CSS/Vanilla JS | Lightweight, zero build step, instant deploy |
| **Deployment** | Vercel + HuggingFace Spaces | Free tier, auto-scaling, serverless |
| **Visualisation** | Chart.js | Interactive AUC comparison chart |
 
---
 
## 🧠 Key Technical Decisions
 
| Decision | Choice | Why | Impact |
|----------|--------|-----|--------|
| **Churn threshold** | 90 days | E-commerce industry standard; represents one fiscal quarter. Shorter windows flag healthy customers as churned; longer windows make intervention too late. | 35.5% churn rate — balanced enough for model training |
| **Cluster count (k)** | 4 | Elbow method suggested 3-5. k=4 gives the most distinct, actionable marketing personas: VIP, Loyal, New, At-Risk. k=3 merged Loyal and VIP; k=5 created indistinguishable micro-segments. | Clean business narratives for non-technical stakeholders |
| **Clustering features** | Frequency, Monetary, AOV, ProductDiversity | Deliberately excluded Recency to prevent data leakage with churn label. Cluster on *how* customers buy, not *when* they last bought. | Fixed 97.8% → 79.8% AUC inflation |
| **Best model** | XGBoost | Highest AUC (0.798). For pure recall, Naive Bayes (81.9%) is better — catching more churners matters more than false positives when discount cost is low. | Balanced precision/recall tradeoff for recommendations |
| **Outlier removal** | 3× IQR | Removed 375 extreme outliers (8.6% of data) before clustering to prevent centroid distortion. Standard IQR (1.5×) was too aggressive. | Stable, meaningful cluster boundaries |
| **Frontend framework** | Vanilla JS | UI complexity didn't justify React's overhead. No build step = faster iteration, easier deployment to Vercel. | Zero config deploy, readable codebase |
| **API framework** | FastAPI | Auto-generates OpenAPI/Swagger docs. Pydantic schemas enforce input validation at the schema level. Async support for future scaling. | Prevents out-of-distribution inputs crashing the model |
 
---
 
## 📈 Model Performance
 
| Model | AUC | F1 | Precision | Recall | Speed |
|-------|-----|----|----|--------|-------|
| **XGBoost** ⭐ | **0.798** | 0.658 | 0.560 | 0.797 | 1.82s |
| Naive Bayes | 0.794 | **0.661** | 0.554 | **0.819** | 0.01s |
| Lasso (L1) | 0.791 | 0.656 | 0.571 | 0.769 | 0.01s |
| Logistic Regression | 0.791 | 0.653 | 0.570 | 0.765 | 0.02s |
| Ridge Classifier | 0.789 | 0.654 | 0.563 | 0.779 | 0.02s |
| KNN | 0.734 | 0.519 | **0.591** | 0.463 | 0.01s |
 
**Production recommendation:** XGBoost for AUC-sensitive use cases. Naive Bayes if the priority is catching every churner (recall) and false positive cost is low.
 
### ⚠️ Critical Fix: Data Leakage (AUC 97.8% → 79.8%)
 
This was the most significant technical challenge of the project.
 
**Initial symptom:** New and At-Risk segments both showed 100% churn rate. Models reported 97.8% AUC.
 
**Root cause:** Recency was used for both clustering (high Recency → At-Risk cluster) AND the churn label (Recency > 90 → Churned = 1). This created perfect correlation — the model was essentially predicting the cluster, not churn.
 
**Investigation steps:**
```python
# Smoking gun: cluster-churn crosstab
print(pd.crosstab(train['Cluster'], train['Churned'], margins=True))
 
# Result BEFORE fix:
# Cluster 1 (New):     0 not-churned, 481 churned  ← 100% churn
# Cluster 3 (At-Risk): 0 not-churned, 401 churned  ← 100% churn
```
 
**Fix applied:**
1. Removed Recency from KMeans clustering features
2. Re-clustered on `Frequency, Monetary, AOV, ProductDiversity`
3. Defined churn independently: `Churned = (Recency > 90).astype(int)`
4. Removed outliers (3× IQR) before clustering
5. Retrained all 6 models with sklearn 1.8.0 for version consistency
**Result after fix:**
```python
# Every cluster now has both churned and non-churned customers
# Cluster 0 (New):     192 not-churned, 4 churned
# Cluster 1 (VIP):     305 not-churned, 208 churned
# Cluster 2 (At-Risk): 413 not-churned, 24 churned
# Cluster 3 (Loyal):   731 not-churned, 113 churned
```
 
AUC dropped to a realistic 79.8% — but the model now makes genuine predictions rather than memorising a label.
 
---
 
## 🎯 Customer Segments
 
| Segment | Cluster | Size | Avg Orders | Avg Spend | Avg AOV | Churn Rate | Action |
|---------|---------|------|-----------|-----------|---------|------------|--------|
| **VIP** | 1 | 11% | 8.5 | £3,294 | £441 | 6.5% | Upsell, loyalty program |
| **Loyal** | 3 | 21% | 4.8 | £1,294 | £287 | 12.7% | Cross-sell, maintain |
| **New** | 0 | 13% | 1.8 | £1,175 | £653 | 40.2% | Welcome campaign, 2nd purchase |
| **At-Risk** | 2 | 56% | 1.7 | £346 | £215 | 48.4% | Win-back, discount voucher |
 
---
 
## 💰 Business Impact
 
The model identified approximately **2,429 customers** (56% of the base) as At-Risk of churning within 90 days.
 
**Conservative retention scenario:**
- Industry win-back campaign conversion rate: 5%
- Customers retained: 2,429 × 5% = **~121 customers**
- Average quarterly spend per customer: **£240 AOV × ~1.7 orders = £408**
- **Quarterly revenue protected: ~£49,000**
- Cost of campaign (£10 voucher per customer): £24,290
- **Net benefit: ~£24,710 per quarter**
Even at a 2% conversion rate, the model pays for itself. More importantly, without segmentation, a marketing team would waste budget sending win-back offers to VIP customers (6.5% churn) who weren't leaving anyway.
 
---
 
## ⚠️ Known Limitations
 
| Limitation | Detail | Mitigation |
|------------|--------|------------|
| **Geographic bias** | Dataset is from a single UK retailer (UCI Online Retail). AOV thresholds, seasonality, and buying patterns may not generalise to US or Asian markets. | Retrain on local data before deploying in other regions |
| **Small customer base** | 4,338 customers is sufficient for a portfolio demo but small for production ML. Confidence intervals on segment assignments are wide. | Collect more data; consider bootstrapping for uncertainty estimates |
| **KMeans instability** | KMeans cluster numbers change on every rerun. Segment assignments are auto-mapped by cluster characteristics (highest Monetary = VIP), but edge cases can cause misassignment. | Fixed with `random_state=42`; auto-mapping logic in `segmentation.ipynb` |
| **Static model (no drift detection)** | Consumer behaviour changes over time. The 90-day threshold and cluster boundaries are fixed to May 2026 data. | See Roadmap — Evidently AI integration planned |
| **No rate limiting** | The public API has no authentication or rate limiting. A malicious actor could spam endpoints. | JWT/OAuth2 authentication planned for v2 |
| **Cold starts** | HuggingFace Spaces free tier hibernates after inactivity. First request after sleep takes ~15 seconds. | Upgrade to paid tier or add a health-check ping |
 
---
 
## 🗺️ Production Roadmap
 
**v1.1 — Security & Reliability**
- [ ] JWT/OAuth2 authentication on FastAPI endpoints
- [ ] Rate limiting (slowapi middleware)
- [ ] Input sanitisation audit
- [ ] Error logging with Sentry
**v1.2 — MLOps**
- [ ] Evidently AI for data drift monitoring
- [ ] Apache Airflow for monthly model retraining pipeline
- [ ] MLflow experiment tracking
- [ ] Model versioning with DVC
**v1.3 — Data & Scale**
- [ ] PostgreSQL database to track customer cluster transitions over time
- [ ] Live data connector (Snowflake or BigQuery)
- [ ] Batch prediction endpoint for processing full customer lists
- [ ] REST webhooks to trigger CRM actions (e.g. auto-enrol At-Risk in Klaviyo campaign)
**v2.0 — Product**
- [ ] Multi-tenant support (multiple business accounts)
- [ ] Custom churn threshold configuration per business
- [ ] CSV upload for bulk customer scoring
- [ ] Automated PDF retention reports
---
 
## 🔒 Data & Ethics
 
**Privacy by Design — Stateless API:**
The FastAPI backend is entirely stateless. Customer data submitted via the dashboard exists only in the RAM of the HuggingFace container for the milliseconds required to run inference. No customer PII, financial data, or input values are logged, stored, or used to retrain models. This architecture is GDPR-compliant by design.
 
**Model Fairness:**
The model was trained on transactional behaviour only — Frequency, Monetary, AOV, Tenure, ProductDiversity, ReturnRate. No demographic data (age, gender, location, ethnicity) was included. Churn predictions are based purely on purchase patterns.
 
**Transparency:**
The dashboard exposes the model's confidence (churn probability as a percentage) rather than a binary yes/no label. Users can see exactly which inputs drove the prediction and switch between 6 models to cross-validate results.
 
**Honest Uncertainty:**
At-Risk customers at 48.4% churn rate means 51.6% of that segment is NOT churning. The system recommends interventions, not certainties.
 
---
 
## 📚 Data Pipeline
 
```
Raw Transactions (541,909 rows, 8 columns)
        ↓
  [Phase 1] Data Cleaning (data_cleaning.ipynb)
  - Remove nulls, negative quantities, cancelled orders (C-prefixed)
  - Filter valid 5-digit CustomerIDs
        ↓ (392K clean transactions, 4,338 customers)
 
  [Phase 2] RFM + Segmentation (segmentation.ipynb)
  - Calculate Recency, Frequency, Monetary per customer
  - Remove outliers: 3× IQR on Frequency, Monetary, AOV, ProductDiversity
  - K-Means clustering (k=4) on Frequency, Monetary, AOV, ProductDiversity
  - Auto-assign segment names by cluster centroid characteristics
        ↓ (4,338 → 3,963 after outlier removal, 4 labelled segments)
 
  [Phase 3] Feature Engineering (segmentation.ipynb cont.)
  - AOV = total_revenue / order_count
  - Tenure = last_purchase_date - first_purchase_date (days)
  - ProductDiversity = count(distinct StockCodes)
  - ReturnRate = return_transactions / total_transactions
  - Churned = 1 if Recency > 90 else 0  (independent of clustering)
        ↓ (7 features: Frequency, Monetary, Cluster, AOV, Tenure, ProductDiversity, ReturnRate)
 
  [Phase 4] Model Training (model.ipynb)
  - 80/20 stratified train-test split → Train: 3,170 | Test: 1,168
  - 6 models with class_weight='balanced' to handle churn imbalance
  - Hyperparameter: scale_pos_weight for XGBoost
  - Save all models + feature_names + segment_map as .pkl
        ↓ (XGBoost: 0.798 AUC | Naive Bayes: 81.9% recall)
 
  [Phase 5] Backend (backend/app/)
  - FastAPI loads all 6 models at startup (once, not per request)
  - Pydantic validates inputs against training distribution bounds
  - 4 endpoints: health, predict-churn, segment, models/compare
        ↓
 
  [Phase 6] Frontend (frontend/)
  - 3-tab dashboard: Churn Prediction, Segmentation, Model Comparison
  - Pre-filled examples for all 4 segments
  - Real-time input validation before API calls
  - Chart.js AUC bar chart
```
 
---
 
## 🔧 API Reference
 
**Base URL:** `https://gagan61-customer-analytics-api.hf.space`
 
### GET /
```json
// Response
{"status": "healthy", "models_loaded": 6, "version": "1.0.0"}
```
 
### POST /predict-churn
```json
// Request
{
  "frequency": 4,        // orders, range: 1-20
  "monetary": 1295.0,    // total £ spend, range: 1-10000
  "cluster": 3,          // 0=New, 1=VIP, 2=At-Risk, 3=Loyal
  "aov": 287.0,          // avg order value £, range: 1-2000
  "tenure": 107,         // days active, range: 0-400
  "product_diversity": 79, // unique products, range: 1-200
  "return_rate": 0.024,  // fraction 0.0-1.0
  "model_choice": "xgboost"
}
 
// Response
{
  "churn_probability": 0.329,
  "risk_level": "Medium",
  "recommendation": "Loyal customer showing signs of disengagement — Offer bonus points.",
  "roi_calculation": {
    "value_at_risk": 425.86,
    "intervention_cost": 10.0,
    "expected_save": 63.88,
    "net_benefit": 53.88,
    "roi": 5.39,
    "worth_intervening": true
  },
  "model_used": "xgboost"
}
```
 
### POST /segment
```json
// Request
{
  "frequency": 1,
  "monetary": 1158.0,
  "aov": 647.0,
  "tenure": 47,
  "product_diversity": 45,
  "return_rate": 0.034
}
 
// Response
{
  "cluster_id": 0,
  "segment_name": "New",
  "cluster_profile": {
    "Frequency": 1.82, "Monetary": 1174.71, "AOV": 653.40,
    "Tenure": 69.68, "ProductDiversity": 45.20, "ReturnRate": 0.02
  }
}
```
 
### GET /models/compare
Returns AUC, F1, Precision, Recall, Speed for all 6 models.
 
---
 
## 💡 Key Learnings
 
### What this project taught me about ML in production
 
**1. Perfect metrics are a red flag, not a green one.**
When all 6 models showed 97-99% AUC, the correct response was suspicion, not celebration. Learning to distrust suspiciously good results and systematically investigate why is a more valuable skill than knowing which algorithm to run.
 
**2. The pipeline matters more than the model.**
The model itself was straightforward. The hard parts were: ensuring the clustering scaler matched the backend version, handling KMeans cluster number instability across reruns, correctly ordering features for inference, and managing two separate `saved_models/` directories. In production ML, operational correctness dominates algorithmic sophistication.
 
**3. Version pinning is not optional.**
A single sklearn minor version bump (1.7.2 → 1.8.0) caused the backend to return subtly wrong predictions without any error. The fix required retraining everything inside the deployment virtual environment. Add version pinning to `requirements.txt` from day one.
 
**4. When not to use clustering for label creation.**
Using the same feature (Recency) to both cluster customers AND define churn created a circular dependency. The lesson: keep your unsupervised segmentation features and your supervised label features strictly separate, especially when the label is derived from the same raw signals used for clustering.
 
---
 
## 🚀 Quick Start
 
### Run Locally
 
```bash
# 1. Clone
git clone https://github.com/Gagandeep61/customer-analytics-platform.git
cd customer-analytics-platform
 
# 2. Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
 
# 3. Start backend
uvicorn app.main:app --reload --port 8000
# API docs at: http://localhost:8000/docs
 
# 4. Open frontend
# Open frontend/index.html in browser
# Or: python -m http.server 3000 (from frontend folder)
```
 
### Update API URL for local dev
 
In `frontend/script.js` line 5:
```javascript
const API_URL = 'http://localhost:8000';
```
 
---
 
## 🎓 Interview Talking Points

**"Walk me through this project"**

> "Built an end-to-end ML system for customer churn prediction and segmentation. Started with 541K retail transactions, cleaned to 4,338 customers. Engineered RFM features plus AOV, Tenure, ProductDiversity. Trained 6 models — XGBoost achieved 79.8% AUC.
>
> Most importantly, I discovered and fixed a data leakage issue where initial models showed 97.8% AUC. The churn label was perfectly correlated with cluster assignments because both used Recency. I separated these by clustering on behavioral features only and defining churn independently with a 90-day threshold. This dropped AUC to a realistic 79.8% but made the model trustworthy.
>
> Built a FastAPI backend with 4 endpoints deployed to HuggingFace Spaces with Docker. Created a vanilla JS frontend on Vercel. The system segments customers and identifies at-risk ones with actionable retention recommendations."

**"What was your biggest technical challenge?"**

> "Data leakage. All 6 models showed 97-99% AUC, which seemed suspicious rather than impressive. I investigated by analyzing cluster-churn crosstabs and found New and At-Risk segments had exactly 100% churn rate — statistically impossible in real data.
>
> Root cause: Recency defined both clustering (high Recency → At-Risk cluster) AND the churn label (Recency > 90 → churned). The model wasn't predicting churn — it was predicting cluster membership.
>
> Fix: removed Recency from clustering features entirely, re-clustered on behavioral signals (Frequency, Monetary, AOV, ProductDiversity), defined churn independently. This is a textbook data leakage pattern that many practitioners miss because the metrics look great."

**"How did you choose XGBoost over the other 5 models?"**

> "I didn't just choose it — I trained all 6 and let the data decide. XGBoost won on AUC (0.798) which measures overall discrimination ability. But I'd actually argue Naive Bayes deserves consideration for production: it has the highest recall at 81.9%, meaning it catches more churners. In retention use cases, the cost of a false positive (sending an unnecessary £10 voucher) is much lower than a false negative (losing a customer worth £346). The business context should drive the model choice, not just the leaderboard."

**"Why did you use a 90-day churn threshold?"**

> "Two reasons — quantitative and qualitative. Quantitatively, it gave a 35.5% churn rate which is healthy for model training — not too imbalanced. Qualitatively, 90 days is the e-commerce industry standard for non-subscription retail. It maps to one fiscal quarter, which is the planning horizon most marketing teams work on. Shorter windows (30 days) flag customers who just have natural buying gaps as churned. Longer windows (180 days) mean it's too late to intervene by the time you act."

**"Why did you choose this tech stack?"**

> "Every choice was deliberate. FastAPI over Flask because it auto-generates OpenAPI docs and enforces input validation through Pydantic — which turned out to be critical when I discovered the API accepted out-of-distribution values like return_rate=50.0 and cluster=99 without error. Docker for reproducibility — the sklearn version mismatch between notebooks and backend taught me that the hard way. HuggingFace Spaces because it's purpose-built for ML model serving on a free tier. Vanilla JS over React because the UI complexity didn't justify a build pipeline — zero config means faster iteration and easier debugging."

**"What would you do differently?"**

> "Three things. First, version-pin dependencies from day one — a sklearn minor version bump caused silent wrong predictions that took hours to debug. Second, I'd separate the notebook environment from the deployment environment earlier, running all training inside the same venv as the backend. Third, I'd add Evidently AI for data drift monitoring from the start — the 90-day churn threshold is calibrated to 2010-2011 UK retail data, and consumer behavior has shifted significantly since then."

---

## 🤝 Contributing

```bash
git checkout -b feature/your-improvement
git commit -m "Add: your improvement description"
git push origin feature/your-improvement
# Open Pull Request
```
 
---
 
## 📝 License
 
MIT License — free to use for learning or commercial purposes.
 
---
 
## 👤 Author
 
**Gagan** — Full-Stack ML Engineer
 
**Skills demonstrated in this project:**
`Data Engineering` · `Feature Engineering` · `Unsupervised ML (KMeans)` · `Supervised ML (XGBoost, Logistic, etc.)` · `Data Leakage Detection` · `FastAPI` · `Docker` · `Pydantic Validation` · `Frontend Development` · `Cloud Deployment`
 
---
 
## 🙏 Acknowledgments
 
- **Dataset:** UCI Machine Learning Repository — Online Retail Dataset (UK retailer, 2010-2011)
- **Inspiration:** Real-world customer retention problem in e-commerce
- **Community:** Scikit-learn, FastAPI, HuggingFace, Vercel documentation teams
---
 
**⭐ If this project helped you understand end-to-end ML deployment, please star the repo.**
 
*Last updated: May 2026*
 