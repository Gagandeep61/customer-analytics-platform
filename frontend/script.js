// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// Change this URL when you deploy to HuggingFace
// ─────────────────────────────────────────────────────────────
const API_URL = 'https://gagan61-customer-analytics-api.hf.space';
// const API_URL = 'https://YOUR_USERNAME-customer-analytics-api.hf.space';  // PRODUCTION
 
 
// ─────────────────────────────────────────────────────────────
// ON PAGE LOAD
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  checkAPIStatus();
});
 
 
// ─────────────────────────────────────────────────────────────
// API STATUS CHECK
// Pings the backend to see if it's running
// ─────────────────────────────────────────────────────────────
async function checkAPIStatus(retries = 0, maxRetries = 5) {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
 
  try {
    const response = await fetch(`${API_URL}/`, { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
 
    if (data.status === 'healthy') {
      dot.className  = 'w-2 h-2 rounded-full bg-green-400';
      text.textContent = `API Online · ${data.models_loaded} models`;
      return;
    }
  } catch (err) {
    if (retries < maxRetries) {
      text.textContent = `Backend warming up... (${retries + 1}/${maxRetries})`;
      dot.className = 'w-2 h-2 rounded-full bg-yellow-400 animate-pulse';
      setTimeout(() => checkAPIStatus(retries + 1, maxRetries), 2000);
      return;
    }
    
    dot.className  = 'w-2 h-2 rounded-full bg-red-400';
    text.textContent = 'API Offline — please try again in a moment';
    setTimeout(() => checkAPIStatus(0, maxRetries), 5000);
  }
}
 
 
// ─────────────────────────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────────────────────────
function switchTab(tabName) {
  // Hide all tab content panels
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
 
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
 
  // Show selected tab panel
  document.getElementById(`tab-content-${tabName}`).classList.remove('hidden');
 
  // Activate selected tab button
  document.getElementById(`tab-${tabName}`).classList.add('active');

  // Auto-load model comparison on tab switch
  if (tabName === 'compare') {
    setTimeout(() => {
      const tbody = document.getElementById('compare-table-body');
      if (tbody.innerText.includes('Click "Load Results"')) {
        loadModelComparison();
      }
    }, 100);
  }
}
 
 
// ─────────────────────────────────────────────────────────────
// QUICK-FILL EXAMPLES — CHURN PREDICTION
// ─────────────────────────────────────────────────────────────
const churnExamples = {
  vip:    { frequency: 6, monetary: 3315, aov: 448, tenure: 192, diversity: 128, returnrate: 0.022, cluster: 1 },
loyal:  { frequency: 4, monetary: 1295, aov: 287, tenure: 107, diversity: 79,  returnrate: 0.024, cluster: 3 },
new:    { frequency: 1, monetary: 1158, aov: 647, tenure: 47,  diversity: 45,  returnrate: 0.034, cluster: 0 },
atrisk: { frequency: 1, monetary: 350,  aov: 215, tenure: 8,   diversity: 21,  returnrate: 0.030, cluster: 2 },
};
 
function fillChurnExample(type) {
  const ex = churnExamples[type];
  document.getElementById('c-frequency').value  = ex.frequency;
  document.getElementById('c-monetary').value    = ex.monetary;
  document.getElementById('c-aov').value         = ex.aov;
  document.getElementById('c-tenure').value      = ex.tenure;
  document.getElementById('c-diversity').value   = ex.diversity;
  document.getElementById('c-returnrate').value  = ex.returnrate;
  document.getElementById('c-cluster').value     = ex.cluster;
}
 
 
// ─────────────────────────────────────────────────────────────
// QUICK-FILL EXAMPLES — SEGMENTATION
// ─────────────────────────────────────────────────────────────
const segExamples = {
  vip:    { frequency: 6, monetary: 3315, aov: 448, tenure: 192, diversity: 128, returnrate: 0.022 },
  loyal:  { frequency: 4, monetary: 1295, aov: 287, tenure: 107, diversity: 79, returnrate: 0.024 },
  new:    { frequency: 1, monetary: 1158, aov: 647, tenure: 47, diversity: 45, returnrate: 0.034 },
  atrisk: { frequency: 1, monetary: 350, aov: 215, tenure: 8, diversity: 21, returnrate: 0.030 },
};
 
function fillSegmentExample(type) {
  const ex = segExamples[type];
  document.getElementById('s-frequency').value  = ex.frequency;
  document.getElementById('s-monetary').value   = ex.monetary;
  document.getElementById('s-aov').value        = ex.aov;
  document.getElementById('s-tenure').value     = ex.tenure;
  document.getElementById('s-diversity').value  = ex.diversity;
  document.getElementById('s-returnrate').value = ex.returnrate;
}
 
 
// ─────────────────────────────────────────────────────────────
// PREDICT CHURN
// ─────────────────────────────────────────────────────────────
async function predictChurn() {
  // Read form values
  const frequency    = parseFloat(document.getElementById('c-frequency').value);
  const monetary     = parseFloat(document.getElementById('c-monetary').value);
  const aov          = parseFloat(document.getElementById('c-aov').value);
  const tenure       = parseInt(document.getElementById('c-tenure').value);
  const diversity    = parseInt(document.getElementById('c-diversity').value);
  const returnrate   = parseFloat(document.getElementById('c-returnrate').value);
  const cluster      = parseInt(document.getElementById('c-cluster').value);
  const model_choice = document.getElementById('c-model').value;
 
  // Basic validation
  if ([frequency, monetary, aov, tenure, diversity, returnrate, cluster].some(isNaN)) {
    showError('churn-error', 'Please fill in all fields before predicting.');
    return;
  }
 
  setLoading('churn', true);
  hideError('churn-error');
 
  try {
    const response = await fetch(`${API_URL}/predict-churn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        frequency, monetary, aov, tenure,
        product_diversity: diversity,
        return_rate: returnrate,
        cluster, model_choice
      })
    });
 
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || `Server error: ${response.status}`);
    }
 
    const data = await response.json();
    displayChurnResults(data);
 
  } catch (err) {
    showError('churn-error', err.message.includes('fetch')
      ? 'Cannot connect to backend. Make sure it is running on localhost:8000'
      : err.message
    );
  } finally {
    setLoading('churn', false);
  }
}
 
function displayChurnResults(data) {
  // Show results, hide placeholder
  document.getElementById('churn-placeholder').classList.add('hidden');
  const results = document.getElementById('churn-results');
  results.classList.remove('hidden');
  results.classList.add('fade-in');
 
  // Churn probability
  const pct = (data.churn_probability * 100).toFixed(1);
  document.getElementById('churn-probability').textContent = `${pct}%`;
 
  // Risk badge
  const badge = document.getElementById('churn-risk-badge');
  const riskClass = {
    'Low':    'badge-low',
    'Medium': 'badge-medium',
    'High':   'badge-high'
  }[data.risk_level] || 'badge-medium';
  badge.className = `inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${riskClass}`;
  badge.textContent = `${data.risk_level} Risk`;
 
  // Model used
  document.getElementById('churn-model-used').textContent = `Predicted using: ${data.model_used}`;
 
  // Recommendation
  document.getElementById('churn-recommendation').textContent = data.recommendation;
 
  // ROI
  const roi = data.roi_calculation;
  document.getElementById('roi-risk').textContent  = `£${roi.value_at_risk.toFixed(0)}`;
  document.getElementById('roi-save').textContent  = `£${roi.expected_save.toFixed(0)}`;
  document.getElementById('roi-cost').textContent  = `£${roi.intervention_cost.toFixed(0)}`;
  document.getElementById('roi-value').textContent = `${roi.roi.toFixed(1)}×`;
}
 
 
// ─────────────────────────────────────────────────────────────
// PREDICT SEGMENT
// ─────────────────────────────────────────────────────────────
async function predictSegment() {
  const frequency  = parseFloat(document.getElementById('s-frequency').value);
  const monetary   = parseFloat(document.getElementById('s-monetary').value);
  const aov        = parseFloat(document.getElementById('s-aov').value);
  const tenure     = parseInt(document.getElementById('s-tenure').value);
  const diversity  = parseInt(document.getElementById('s-diversity').value);
  const returnrate = parseFloat(document.getElementById('s-returnrate').value);
  
  if ([frequency, monetary, aov, tenure, diversity, returnrate].some(isNaN)) {
    showError('seg-error', 'Please fill in all fields.');
    return;
  }
 
  setLoading('seg', true);
  hideError('seg-error');
 
  try {
    const response = await fetch(`${API_URL}/segment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        frequency, monetary, aov, tenure,
        product_diversity: diversity,
        return_rate: returnrate
      })
    });
 
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || `Server error: ${response.status}`);
    }
 
    const data = await response.json();
    displaySegmentResults(data);
 
  } catch (err) {
    showError('seg-error', err.message.includes('fetch')
      ? 'Cannot connect to backend. Make sure it is running on localhost:8000'
      : err.message
    );
  } finally {
    setLoading('seg', false);
  }
}
 
function displaySegmentResults(data) {
  document.getElementById('seg-placeholder').classList.add('hidden');
  const results = document.getElementById('seg-results');
  results.classList.remove('hidden');
  results.classList.add('fade-in');
 
  // Segment name with color
  const nameEl = document.getElementById('seg-name');
  const colorMap = { 'VIP': 'seg-vip', 'Loyal': 'seg-loyal', 'New': 'seg-new', 'At-Risk': 'seg-atrisk' };
  nameEl.className = `text-4xl font-bold mb-2 ${colorMap[data.segment_name] || 'text-white'}`;
  nameEl.textContent = data.segment_name;
 
  document.getElementById('seg-cluster').textContent = `K-Means Cluster ${data.cluster_id}`;
 
  // Cluster profile table
  const profileEl = document.getElementById('seg-profile');
  const labels = {
    Frequency: 'Avg Orders', Monetary: 'Avg Spend (£)',
    AOV: 'Avg Order Value (£)', Tenure: 'Avg Tenure (days)',
    ProductDiversity: 'Avg Unique Products', ReturnRate: 'Avg Return Rate'
  };
 
  profileEl.innerHTML = Object.entries(data.cluster_profile)
    .map(([key, val]) => `
      <div class="flex justify-between items-center py-2 border-b border-slate-800">
        <span class="text-slate-400">${labels[key] || key}</span>
        <span class="text-white font-medium">${typeof val === 'number' ? val.toFixed(2) : val}</span>
      </div>
    `).join('');

    // AUTO-FILL cluster in churn tab
  document.getElementById('c-cluster').value = data.cluster_id;
  
  // Reveal the hidden checkmark in the HTML label (requires the index.html update)
  const autoFillSpan = document.getElementById('cluster-auto-filled');
  if (autoFillSpan) autoFillSpan.classList.remove('hidden');
  
  // Show temporary toast notification
  const notif = document.createElement('div');
  notif.className = 'fixed bottom-4 right-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg text-sm transition-opacity duration-500';
  notif.textContent = `✓ Cluster ${data.cluster_id} auto-filled in Churn tab`;
  document.body.appendChild(notif);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, 3000);
}
 
 
// ─────────────────────────────────────────────────────────────
// MODEL COMPARISON
// ─────────────────────────────────────────────────────────────
let aucChart = null;
 
async function loadModelComparison() {
  hideError('compare-error');
  setLoading('compare', true);
 
  try {
    const response = await fetch(`${API_URL}/models/compare`, {
      signal: AbortSignal.timeout(15000)
    });
 
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
 
    const data = await response.json();
    displayModelComparison(data);
 
  } catch (err) {
    showError('compare-error', 'Cannot connect to backend. Try refreshing or check the API status.');
  } finally {
    setLoading('compare', false);
  }
}
 
function displayModelComparison(data) {
  const tbody = document.getElementById('compare-table-body');
  const bestModel = data.best_auc_model;
 
  // Build table rows
  tbody.innerHTML = data.models.map(m => {
    const isBest = m.name === bestModel;
    const rowClass = isBest ? 'best-model-row' : '';
 
    return `
      <tr class="${rowClass} border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
        <td class="py-3 px-4 font-medium text-white">
          ${m.name}
          ${isBest ? '<span class="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Best AUC</span>' : ''}
        </td>
        <td class="py-3 px-4 text-center font-mono text-blue-400">${m.auc}</td>
        <td class="py-3 px-4 text-center font-mono text-green-400">${m.f1}</td>
        <td class="py-3 px-4 text-center font-mono text-slate-300">${m.precision}</td>
        <td class="py-3 px-4 text-center font-mono text-slate-300">${m.recall}</td>
        <td class="py-3 px-4 text-center font-mono text-slate-400">${m.time_s}s</td>
        <td class="py-3 px-4 text-slate-400 text-xs">${m.best_for}</td>
      </tr>
    `;
  }).join('');
 
  // Draw AUC chart
  drawAUCChart(data.models);
}
 
function drawAUCChart(models) {
  const ctx = document.getElementById('auc-chart').getContext('2d');
 
  // Destroy existing chart if any
  if (aucChart) aucChart.destroy();
 
  const labels = models.map(m => m.name);
  const aucs   = models.map(m => m.auc);
  const colors = models.map(m => m.name === 'XGBoost' ? '#3b82f6' : '#475569');
 
  aucChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'AUC Score',
        data: aucs,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` AUC: ${ctx.raw}`
          }
        }
      },
      scales: {
        y: {
          min: 0.6,
          max: 1.0,
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}
 
 
// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
 
function setLoading(prefix, isLoading) {
  const btnText = document.getElementById(`${prefix}-btn-text`);
  const spinner = document.getElementById(`${prefix}-spinner`);
  // Find the parent button of the btn-text span
  const btn = btnText ? btnText.closest('button') : null;

  if (isLoading) {
    if (btnText) btnText.textContent = 'Loading...';
    if (spinner) spinner.classList.remove('hidden');
    if (btn) btn.disabled = true;           // ← prevent double-submit
  } else {
    if (prefix === 'churn')   { if (btnText) btnText.textContent = 'Predict Churn Risk'; }
    if (prefix === 'seg')     { if (btnText) btnText.textContent = 'Find Segment'; }
    if (prefix === 'compare') { if (btnText) btnText.textContent = 'Load Results'; }
    if (spinner) spinner.classList.add('hidden');
    if (btn) btn.disabled = false;          // ← re-enable
  }
}
 
function showError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = `⚠️ ${message}`;
    el.classList.remove('hidden');
  }
}
 
function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}
 