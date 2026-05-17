# 🎨 Frontend Dashboard — Customer Analytics Platform

**Interactive web interface for churn prediction & segmentation**

Live at: https://customer-analytics-platform-one.vercel.app

---

## 📱 Features

### 3 Interactive Tabs

**Tab 1: Churn Prediction** ⚠️
- Enter customer details (7 inputs)
- Select which ML model to use
- Get churn probability + risk level
- See business recommendation
- View ROI calculation
- Quick-fill example buttons (VIP, Loyal, New, At-Risk)

**Tab 2: Customer Segmentation** 👥
- Enter customer data (7 inputs)
- Get segment assignment (VIP, Loyal, New, At-Risk)
- See cluster profile (average stats for that segment)
- Quick-fill examples

**Tab 3: Model Comparison** 📊
- View all 6 model metrics in a table
- AUC bar chart visualization
- See which model is best
- Understand speed vs accuracy tradeoff

---

## 🚀 Quick Start

### Online (No Setup)
Just visit: **https://customer-analytics-platform-one.vercel.app** 🎉

### Local Development

**1. Navigate to frontend**
```bash
cd frontend
```

**2. Start a local server**

Option A: Python
```bash
python -m http.server 3000
# Visit: http://localhost:3000
```

Option B: VS Code
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

Option C: Any HTTP server
```bash
npm install -g http-server
http-server -p 3000
```

---

## 📖 How to Use

### Tab 1: Predict Churn Risk ⚠️

**Method A: Use Example Buttons**

1. Click **"VIP"** button → form auto-fills with VIP customer data
2. Click **"Predict Churn Risk"** button
3. See results on right panel:
   - Churn probability %
   - Risk badge (Low/Medium/High)
   - Recommended action
   - Business impact (ROI calculation)

**Method B: Manual Input**

1. Fill in all 7 fields:
   - **Frequency:** How many orders? (1-100)
   - **Monetary:** Total spend in £? (10-50000)
   - **AOV:** Average order value in £? (10-1000)
   - **Tenure:** Days active? (1-500)
   - **Product Diversity:** Unique products bought? (1-200)
   - **Return Rate:** Fraction of returns? (0-1, e.g. 0.05 = 5%)
   - **Cluster:** Customer segment (0-3, or use Segmentation tab to find)

2. Select **ML Model** from dropdown:
   - XGBoost (best accuracy)
   - KNN (fastest)
   - Logistic, Ridge, Lasso, Naive Bayes

3. Click **"Predict Churn Risk"**

4. **Interpret Results:**
   - **0-30% churn:** Low Risk ✅ (safe customer)
   - **30-70% churn:** Medium Risk ⚠️ (monitor)
   - **70-100% churn:** High Risk ❌ (urgent intervention)

5. **ROI Calculation:**
   - **Value at Risk:** Revenue you'll lose if they churn
   - **Expected Save:** Revenue you'll keep with intervention
   - **Intervention Cost:** Cost of retention offer (e.g. discount)
   - **ROI:** Is it worth it? (>1 = yes, send the offer)

---

### Tab 2: Customer Segmentation 👥

**What it does:** Tells you which of 4 customer groups someone belongs to

**Steps:**

1. Click a **Quick-Fill Example:**
   - **VIP:** High-value, loyal (rare, protect them)
   - **Loyal:** Medium-value, consistent (keep engaged)
   - **New:** Low-value, just starting (nurture them)
   - **At-Risk:** Inactive, about to churn (win them back)

2. Or **enter data manually:**
   - Same 6 fields as Churn tab (no Cluster needed)
   - Also requires **Recency:** days since last purchase

3. Click **"Find Segment"**

4. **See Results:**
   - Segment name with color coding
   - K-Means Cluster ID (0-3)
   - **Cluster Profile:** Average stats for that segment
     - Compares this customer to the segment average
     - Shows if they're typical or outliers

**Use Cases:**
- "Is this person really VIP?" → Check cluster profile
- "Why is this customer at-risk?" → See low Frequency + high Recency
- "Should I spend on retention?" → Check their segment's typical value

---

### Tab 3: Model Comparison 📊

**What it shows:** How different ML models perform

**Steps:**

1. Click **"Load Results"**
2. See **Metrics Table:**
   - **AUC:** Overall accuracy (0.937-0.980, higher is better)
   - **F1:** Balance of precision & recall (0.833-0.907)
   - **Precision:** Of predicted churners, how many actually churn?
   - **Recall:** Of actual churners, how many did we catch?
   - **Time:** How fast? (0.01s-0.05s)

3. See **AUC Bar Chart:**
   - Visual comparison of all 6 models
   - XGBoost highlighted (best AUC)

**Key Insights:**
- **XGBoost wins** on accuracy (0.980 AUC) but slower (0.05s)
- **KNN is best for production** (0.966 AUC, but 182× faster!)
- **Naive Bayes is fastest** (0.01s) but less accurate (0.937)
- **Trade-off:** Speed vs accuracy — pick based on your needs

---

## 🎨 Visual Guide

### Color Scheme
- **Amber/Golden:** VIP (high-value)
- **Blue:** Loyal (medium-value, consistent)
- **Green:** New (new customers, potential)
- **Red:** At-Risk (high churn risk)

### Buttons
- **Quick-Fill (colored):** Load example data
- **"View segment reference above":** Jump to legend
- **"Predict Churn Risk":** Submit form and get prediction

### Badge Colors (Risk Levels)
- 🟢 **Green:** Low Risk (save nothing, they'll stay)
- 🟡 **Purple:** Medium Risk (worth a gentle touch)
- 🔴 **Red:** High Risk (urgent intervention needed)

---

## 💡 Example Scenarios

### Scenario 1: Check if a VIP is about to leave
1. Go to **Churn tab**
2. Click **"VIP"** button
3. Predict → see "0.1% churn" ✅
4. Recommendation: "Upsell or cross-sell"
5. ROI: Positive (offer them premium products)

### Scenario 2: Find out why a customer churned
1. Go to **Segmentation tab**
2. Enter their data manually
3. Click **"Find Segment"** → see "At-Risk"
4. Check **Cluster Profile** → see very low Frequency + high Recency
5. Insight: They didn't buy often, now it's been months
6. Action: Win-back email with special offer

### Scenario 3: Decide which model to use
1. Go to **Model Comparison tab**
2. Click **"Load Results"**
3. See XGBoost (0.980 AUC) vs KNN (0.966 AUC)
4. XGBoost is 0.014 points better but 182× slower
5. Decision: Use KNN for real-time predictions, XGBoost for batch analysis

---

## 🔗 API Connection

### How It Works
```
You click "Predict" 
    ↓
Frontend sends data to backend API
    ↓
Backend loads ML model
    ↓
Model makes prediction
    ↓
Backend returns results
    ↓
Frontend displays in nice format
```

### Connection Status
- 🟢 **Green dot (top right):** Backend is running ✅
- 🔴 **Red dot:** Backend offline ❌ (start it with `uvicorn`)

### API URL
Currently set to: `https://gagan61-customer-analytics-api.hf.space`

To change (for local testing):
1. Open `frontend/script.js`
2. Find line 10: `const API_URL = '...'`
3. Change to: `http://localhost:8000` (for local backend)

---

## 📱 Responsive Design

Works on:
- ✅ Desktop (1920x1080 and up)
- ✅ Tablet (iPad, 768px+)
- ✅ Mobile (370px+, tested on iPhone 12)

All inputs scale and reflow on small screens.

---

## ⚡ Performance

| Action | Time |
|--------|------|
| Load page | <1s |
| Predict churn | 200-500ms |
| Segment | 150-300ms |
| Load model comparison | 300-600ms |

**Cold start (first request to HF):** 15 seconds (free tier limitation)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Page won't load** | Check internet, refresh (Ctrl+F5) |
| **Red dot, "API Offline"** | Start backend: `uvicorn app.main:app --reload` |
| **"Cannot connect to backend"** | Check API_URL in script.js is correct |
| **Fields not filling when clicking example** | Hard refresh (Ctrl+Shift+R) |
| **Results show old predictions** | Restart backend, hard refresh |
| **Model comparison shows no data** | Click "Load Results" button |
| **Buttons don't scroll to reference** | Browser issue, scroll manually |

---

## 📂 Project Files

```
frontend/
├── index.html          # Page structure (3 tabs, forms, results)
├── style.css           # Custom styles (colors, animations, badges)
├── script.js           # API calls, tab switching, form handling
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

### Key Functions in script.js
- `switchTab(tabName)` — Switch between tabs
- `fillChurnExample(type)` — Auto-fill form with examples
- `fillSegmentExample(type)` — Auto-fill segmentation form
- `predictChurn()` — Call /predict-churn endpoint
- `predictSegment()` — Call /segment endpoint
- `loadModelComparison()` — Call /models/compare endpoint
- `displayChurnResults(data)` — Show prediction results
- `displaySegmentResults(data)` — Show segment results
- `setLoading(prefix, bool)` — Show/hide loading spinner

---

## 🎯 Best Practices

**DO:**
- ✅ Use example buttons to understand format
- ✅ Check segment profile to understand the segment
- ✅ Use Model Comparison tab to learn model differences
- ✅ Check the red/green API status dot

**DON'T:**
- ❌ Enter unrealistic values (Frequency: 10000)
- ❌ Forget to select a cluster for churn prediction
- ❌ Assume predictions are 100% accurate
- ❌ Ignore ROI calculations in business decisions

---

## 📚 Learning Resources

- **About churn:** Why do customers leave? How to measure it?
- **About RFM:** Recency, Frequency, Monetary value analysis
- **About clustering:** How K-Means groups similar customers
- **About churn models:** How to predict who'll leave

Start with the **Churn Prediction** tab and try different customer profiles to see how the model responds.

---

## 🚀 Deployment

### Live
Automatically deployed to Vercel on every push to GitHub.

### Local Testing
```bash
python -m http.server 3000
# Visit: http://localhost:3000
```

### Production Checklist
- [x] API_URL points to live backend
- [x] All 3 tabs working
- [x] Quick-fill examples working
- [x] Model comparison loading
- [x] Responsive on mobile
- [x] Error messages clear
- [x] Loading spinners visible

---

## 📞 Support

- **Dashboard not loading?** → Hard refresh (Ctrl+Shift+R)
- **API offline?** → Check the red dot (top right)
- **Don't understand a term?** → Hover over field labels
- **Want to modify?** → Edit `script.js` and redeploy

---

**Last Updated:** May 2026  
**Status:** Live on Vercel ✅  
**Framework:** Vanilla JS + HTML + CSS (no build step)
