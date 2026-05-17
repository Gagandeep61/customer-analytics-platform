# 📊 Data — Customer Analytics Platform

**Datasets used for ML training and inference**

All data is pre-processed and ready for model training. Original source: UCI Online Retail dataset (500K+ transactions).

---

## 📁 Data Files Overview

```
data/
├── cleaned_transactions.csv         # Phase 1: Cleaned transactions
├── rfm_segments.csv                 # Phase 2: RFM + K-Means clusters
├── customer_features.csv            # Phase 2.5: All features + churn label
├── train_set.csv                    # Phase 4: Training data (80%)
└── test_set.csv                     # Phase 4: Testing data (20%)
```

---

## 📄 File Descriptions

### 1. `cleaned_transactions.csv`
**Source:** Phase 1 Data Cleaning  
**Purpose:** Raw transaction data after cleaning  
**Size:** 392,692 rows × 8 columns

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| InvoiceNo | string | Unique transaction ID |
| StockCode | string | Product code |
| Description | string | Product name |
| Quantity | int | Units purchased |
| InvoiceDate | datetime | When purchased |
| UnitPrice | float | Price per unit (£) |
| CustomerID | int | Customer identifier (4,338 unique) |
| Country | string | Customer location |

**What was cleaned:**
- ❌ Removed rows with null CustomerID (6,847 rows)
- ❌ Removed zero/negative prices (39,410 rows)
- ❌ Removed cancelled orders (InvoiceNo starting with 'C') (9,288 rows)
- ❌ Removed duplicate rows (1,265 rows)
- ✅ Kept: 392,692 clean transactions from 4,338 customers

**Total Revenue:** £8,839,063.03

---

### 2. `rfm_segments.csv`
**Source:** Phase 2 RFM Segmentation  
**Purpose:** Customer-level RFM features + K-Means clustering  
**Size:** 4,338 rows × 7 columns

**Columns:**
| Column | Type | Range | Description |
|--------|------|-------|-------------|
| CustomerID | int | 1-500009 | Unique customer |
| Recency | int | 0-373 | Days since last purchase |
| Frequency | int | 1-228 | Number of orders |
| Monetary | float | 40.80-280206.02 | Total spending (£) |
| Cluster | int | 0-3 | K-Means cluster (0=VIP, 1=New, 2=Loyal, 3=At-Risk) |
| Segment | string | VIP/Loyal/New/At-Risk | Cluster name |
| PurchaseInterval | float | 0-373 | Avg days between orders |

**How it was created:**
1. **Recency:** `max(InvoiceDate) - customer_last_date` (in days)
2. **Frequency:** Count of distinct InvoiceNo per customer
3. **Monetary:** Sum of (Quantity × UnitPrice) per customer
4. **Clustering:** MinMaxScaler(0-1) → KMeans(k=4) → Elbow method validation

**Segment Distribution:**
| Segment | Count | % | Avg Recency | Avg Frequency | Avg Monetary |
|---------|-------|---|---|---|---|
| VIP | 743 | 17% | 20 days | 6.4 orders | £3,234 |
| Loyal | 1,454 | 34% | 84 days | 2.6 orders | £1,004 |
| New | 822 | 19% | 193 days | 1.9 orders | £719 |
| At-Risk | 1,319 | 30% | 309 days | 1.4 orders | £565 |

---

### 3. `customer_features.csv`
**Source:** Phase 2.5 Feature Engineering  
**Purpose:** All customer features + churn label for ML training  
**Size:** 4,338 rows × 15 columns

**Columns:**
| Column | Type | Range | Description |
|--------|------|-------|-------------|
| CustomerID | int | 1-500009 | Unique customer |
| Recency | int | 0-373 | Days since last purchase |
| Frequency | int | 1-228 | Number of orders |
| Monetary | float | 40.80-280206 | Total spending (£) |
| AOV | float | 40.80-59738.02 | Average Order Value (£) |
| Tenure | int | 1-500 | Days since first order |
| ProductDiversity | int | 1-5157 | Unique products purchased |
| ReturnRate | float | 0-1 | Fraction of cancelled orders |
| Cluster | int | 0-3 | K-Means cluster |
| Segment | string | VIP/Loyal/New/At-Risk | Cluster name |
| PurchaseInterval | float | 0-373 | Avg days between orders |
| Churned | int | 0-1 | **Target variable** (1=churned, 0=active) |
| Set | string | train/test | Train/test split (80/20) |

**How Churn Label Was Created:**
Tenure-aware logic (not just Recency > 90):

```python
if Tenure < 30 days:
    Churned = 1 if Recency > 15 else 0
elif Tenure < 90 days:
    Churned = 1 if Recency > 40 else 0
else:  # Established customer
    Churned = 1 if Recency > 90 else 0
```

**Why tenure-aware?**
- New customers (0-30d) judged by 15-day inactivity
- Somewhat new (30-90d) by 40-day inactivity
- Established (90+d) by 90-day inactivity
- Result: 50/50 balanced classes (perfect for ML!)

**Churn Distribution by Tenure:**
| Tenure Group | Count | Churn % |
|---|---|---|
| Very New (0-30d) | 1,737 | 92.5% |
| Somewhat New (30-90d) | 410 | 50.2% |
| Established (90+d) | 2,102 | 16.8% |
| **Overall** | 4,338 | 50.0% |

**Feature Engineering Details:**

1. **AOV (Average Order Value):**
   ```
   AOV = Monetary / Frequency
   ```
   Shows spending per order (quality of customer)

2. **Tenure (Days Active):**
   ```
   Tenure = max(InvoiceDate) - min(InvoiceDate)
   ```
   How long they've been a customer (loyalty proxy)

3. **ProductDiversity (Unique Products):**
   ```
   Unique products bought
   ```
   Shows breadth of purchases (engagement proxy)

4. **ReturnRate (Return Fraction):**
   ```
   Cancelled orders / Total orders
   ```
   Shows satisfaction (quality indicator)

---

### 4. `train_set.csv`
**Source:** Phase 4 Train/Test Split  
**Purpose:** Training data for ML models (80%)  
**Size:** 3,470 rows × 12 columns

**Columns:** Same as `customer_features.csv` minus Set

**Statistics:**
| Metric | Value |
|--------|-------|
| Total rows | 3,470 |
| Churned customers | 1,733 (49.9%) |
| Active customers | 1,737 (50.1%) |
| Avg Frequency | 2.64 orders |
| Avg Monetary | £1,004 |
| Avg Tenure | 106 days |

**Stratification:** Split stratified by `Churned` to maintain 50/50 balance in both train & test

**Usage in Models:**
```python
X_train = train.drop(columns=['Churned', 'Recency', 'Segment', 'CustomerID'])
y_train = train['Churned']
```

Features used: `[Frequency, Monetary, Cluster, AOV, Tenure, ProductDiversity, ReturnRate]` (7 features)

---

### 5. `test_set.csv`
**Source:** Phase 4 Train/Test Split  
**Purpose:** Testing/validation data for ML models (20%)  
**Size:** 868 rows × 12 columns

**Columns:** Same as `train_set.csv`

**Statistics:**
| Metric | Value |
|--------|-------|
| Total rows | 868 |
| Churned customers | 434 (50.0%) |
| Active customers | 434 (50.0%) |
| Avg Frequency | 2.56 orders |
| Avg Monetary | £989 |
| Avg Tenure | 105 days |

**Usage in Model Evaluation:**
```python
X_test = test.drop(columns=['Churned', 'Recency', 'Segment', 'CustomerID'])
y_test = test['Churned']

# Predictions
y_pred = model.predict(X_test)
accuracy = (y_pred == y_test).mean()
```

---

## 📊 Data Pipeline

```
Raw Transactions (500K rows, 8 cols)
    ↓ [PHASE 1: Cleaning]
    • Remove nulls
    • Remove invalid rows
    • Remove duplicates
    ↓
Cleaned Transactions (392K rows, 8 cols)
    ↓ [PHASE 2: RFM Segmentation]
    • Calculate Recency, Frequency, Monetary
    • MinMaxScaler normalization
    • K-Means clustering (k=4)
    ↓
RFM Segments (4,338 rows, 7 cols)
    ↓ [PHASE 2.5: Feature Engineering]
    • Engineer: AOV, Tenure, ProductDiversity, ReturnRate
    • Create: Tenure-aware churn label
    • 50/50 class balance
    ↓
Customer Features (4,338 rows, 12 cols)
    ↓ [PHASE 4: Train/Test Split]
    • Stratified 80/20 split
    • 3,470 train rows
    • 868 test rows
    ↓
Train Set (3,470 rows) + Test Set (868 rows)
    ↓ [Models Training]
    • Drop Recency & Segment
    • 7 features remain
    • Train 6 ML models
```

---

## 🔍 Data Quality Checks

### Cleaned Data
```python
# No missing values
train.isnull().sum()  # All zeros ✅

# No duplicates
train.duplicated().sum()  # 0 ✅

# Balanced classes
train['Churned'].value_counts()  # 50/50 ✅

# Reasonable ranges
train['Frequency'].min() = 1
train['Frequency'].max() = 228
train['Monetary'].min() = £40.80
train['Monetary'].max() = £280,206
```

### Feature Statistics
```python
train.describe()
# Shows no outliers beyond reason
# All columns have realistic ranges
```

### Train/Test Stratification
```python
# Both have ~50% churn
train['Churned'].mean() = 0.499
test['Churned'].mean() = 0.500
```

---

## 🚀 How to Load & Use

### Python (Pandas)
```python
import pandas as pd

# Load train data
train = pd.read_csv('data/train_set.csv')

# Prepare for ML
X_train = train.drop(columns=['Churned', 'Recency', 'Segment', 'CustomerID'])
y_train = train['Churned']

# Check shape
print(X_train.shape)  # (3470, 7)
print(X_train.columns.tolist())
# ['Frequency', 'Monetary', 'Cluster', 'AOV', 'Tenure', 'ProductDiversity', 'ReturnRate']
```

### Python (NumPy)
```python
import numpy as np
import pandas as pd

# Load as array
data = pd.read_csv('data/train_set.csv').values
X = data[:, :-1]  # All columns except last
y = data[:, -1]   # Last column (Churned)
```

### SQL
```sql
-- Load into database
LOAD DATA INFILE 'train_set.csv' INTO TABLE customers;

-- Query churned customers
SELECT * FROM customers WHERE Churned = 1;

-- Average stats by segment
SELECT Segment, AVG(Frequency), AVG(Monetary) FROM customers GROUP BY Segment;
```

---

## 📈 Data Summary Statistics

### Overall Dataset (4,338 customers)
| Metric | Value |
|--------|-------|
| Total Transactions | 392,692 |
| Total Revenue | £8,839,063 |
| Avg Spend per Customer | £2,038 |
| Avg Orders per Customer | 2.6 |
| Avg Tenure | 106 days |
| Churn Rate | 50% |

### By Segment
| Segment | Count | Churn % | Avg Spend | Avg Orders |
|---------|-------|---------|-----------|-----------|
| VIP | 743 | 17% | £3,234 | 6.4 |
| Loyal | 1,454 | 50% | £1,004 | 2.6 |
| New | 822 | 93% | £719 | 1.9 |
| At-Risk | 1,319 | 100% | £565 | 1.4 |

---

## ⚠️ Important Notes

### What Data is NOT Included
- ❌ Customer names/emails (privacy)
- ❌ Full addresses (privacy)
- ❌ Product costs/margins (business sensitive)
- ❌ Original timestamps (only intervals)

### Data Leakage Prevention
- ❌ Recency NOT used as feature (directly encodes churn)
- ❌ Future data NOT included (only up to analysis date)
- ✅ Strict train/test separation (no data leakage)
- ✅ Stratified split (balanced classes in both)

### Limitations
- **Snapshot data:** Analysis date is fixed (May 2024)
- **Not real-time:** Need retraining with new data quarterly
- **Geographic bias:** Mostly UK customers (country in data)
- **Product bias:** Online retail only (no in-store)

---

## 🔄 How to Retrain with New Data

When you get fresh data:

1. **Place raw transactions in `data/raw/`**
2. **Run Phase 1 notebook** with new data
3. **Output:** New `cleaned_transactions.csv`
4. **Run Phase 2 notebook** (RFM + segmentation)
5. **Output:** New `customer_features.csv`
6. **Run Phase 4 notebook** (train/test split + retraining)
7. **Output:** New trained models in `saved_models/`

---

## 📚 Data Sources & References

**Original Dataset:**
- **Name:** UCI Online Retail Dataset
- **Source:** https://www.kaggle.com/datasets/mashimo/online-retail-ii-uci
- **Records:** 500,521 transactions
- **Date Range:** 2009-2011
- **Countries:** 37

**Feature Engineering References:**
- **RFM Analysis:** https://en.wikipedia.org/wiki/RFM_(customer_value)
- **K-Means:** https://scikit-learn.org/stable/modules/clustering.html#k-means
- **Churn Prediction:** https://en.wikipedia.org/wiki/Customer_attrition

---

## 🔐 Data Privacy & Security

### What's Safe to Share
✅ Aggregate statistics (segment sizes, avg spend)  
✅ Feature distributions (histograms, correlations)  
✅ Model performance metrics (AUC, F1, etc)  

### What's NOT Safe to Share
❌ Individual customer records  
❌ CustomerID with spending data  
❌ Purchase history linked to individuals  
❌ Full transaction details  

**Best Practice:** Use this data only for learning/portfolios, not production without proper consent.

---

## 📞 Questions About Data?

- **"What's the difference between train & test?"** → Train teaches the model, test grades it
- **"Why 50/50 churn?"** → Balanced classes prevent bias toward one class
- **"Can I use this data in production?"** → Only with proper privacy/legal review
- **"How often should I retrain?"** → Monthly or quarterly depending on data volume

---

**Data Last Updated:** May 2026  
**Format:** CSV (text-based, portable)  
**Total Size:** ~50MB  
**Status:** Ready for ML training ✅
