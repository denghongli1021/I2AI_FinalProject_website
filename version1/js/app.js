/* ============================================
   AutoML Pro - Simplified & Refactored
   ============================================ */

// ===== CONFIG CONSTANTS =====
const CONFIG = {
    SCROLL_THRESHOLD: 50,
    PARTICLES_COUNT: 40,
    ANIMATION_DURATION: 2000,
    STEP_DELAY: 500,
};

const DATASETS = {
    classification: {
        credit: '信用卡違約預測',
        churn: '客戶流失分析',
        disease: '疾病風險預測'
    },
    regression: {
        house: '房價預測',
        sales: '銷售額預測',
        energy: '能源消耗預測'
    }
};

const AUTOML_STEPS = [
    { id: 'ps1', label: '載入數據集...', pct: 10 },
    { id: 'ps2', label: '執行數據清洗...', pct: 25 },
    { id: 'ps3', label: '自動特徵工程...', pct: 45 },
    { id: 'ps4', label: '訓練多個模型...', pct: 70 },
    { id: 'ps5', label: '超參數優化中...', pct: 90 },
    { id: 'ps6', label: '生成分析報告...', pct: 100 },
];

const CHART_COLORS = {
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    primaryAlpha: 'rgba(99, 102, 241, 0.2)',
    secondaryAlpha: 'rgba(6, 182, 212, 0.2)',
    successAlpha: 'rgba(16, 185, 129, 0.2)',
};

// ===== GLOBAL STATE =====
let currentTask = 'classification';
let charts = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Page loaded, initializing...');
    
    // Particles
    createParticles();
    
    // Navigation
    setupNavigation();
    
    // Scroll reveals
    setupScrollReveals();
    
    // Dashboard
    setupDashboard();
    
    console.log('✅ All systems initialized!');
});

// ===== NAVIGATION =====
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!navbar || !navToggle || !navMenu) {
        console.warn('⚠️ Navigation elements not found');
        return;
    }
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > CONFIG.SCROLL_THRESHOLD);
        updateActiveNav(navLinks);
    });
    
    // Mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

function updateActiveNav(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const { offsetTop, offsetHeight, id } = section;
        const link = Array.from(navLinks).find(l => l.href.includes(`#${id}`));
        
        if (link) {
            link.classList.toggle('active', scrollY >= offsetTop && scrollY < offsetTop + offsetHeight);
        }
    });
}

// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < CONFIG.PARTICLES_COUNT; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        
        const size = 2 + Math.random() * 4;
        particle.style.width = particle.style.height = size + 'px';
        
        const colors = ['#6366f1', '#06b6d4', '#818cf8', '#22d3ee'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
    }
}

// ===== SCROLL REVEALS =====
function setupScrollReveals() {
    // Counter animation
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const hero = document.getElementById('hero');
    if (hero) heroObserver.observe(hero);
    
    // Element reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.feature-card, .pipeline-step, .model-card, .vision-card').forEach(el => {
        revealObserver.observe(el);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.target || 0);
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / CONFIG.ANIMATION_DURATION, 1);
            const value = target * (1 - Math.pow(1 - progress, 3));
            counter.textContent = target % 1 !== 0 ? value.toFixed(1) : Math.floor(value);
            
            if (progress < 1) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    });
}

// ===== DASHBOARD =====
function setupDashboard() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const chartTabs = document.querySelectorAll('.chart-tab');
    const runBtn = document.getElementById('runBtn');
    const datasetSelect = document.getElementById('datasetSelect');
    
    if (!runBtn) {
        console.error('❌ Run button not found!');
        return;
    }
    
    console.log('📊 Dashboard setup:', {
        toggleBtns: toggleBtns.length,
        chartTabs: chartTabs.length,
        runBtn: !!runBtn,
        datasetSelect: !!datasetSelect
    });
    
    // Task toggle
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTask = btn.dataset.task;
            
            if (datasetSelect) {
                updateDatasetOptions(currentTask, datasetSelect);
            }
        });
    });
    
    // Chart tabs
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.chart-panel').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const panel = document.getElementById(`panel-${tab.dataset.chart}`);
            if (panel) panel.classList.add('active');
        });
    });
    
    // Run button
    runBtn.addEventListener('click', () => {
        console.log('🎬 Running AutoML for:', currentTask);
        runAutoML();
    });
}

function updateDatasetOptions(task, select) {
    const options = DATASETS[task] || {};
    select.innerHTML = Object.entries(options)
        .map(([key, label]) => `<option value="${key}">${label}</option>`)
        .join('');
}

function runAutoML() {
    const progressSection = document.getElementById('progressSection');
    const dashboardResults = document.getElementById('dashboardResults');
    
    if (!progressSection || !dashboardResults) {
        console.error('❌ Progress or results section not found');
        return;
    }
    
    console.log('▶️ AutoML execution started');
    
    // Reset UI
    progressSection.style.display = 'block';
    dashboardResults.style.display = 'none';
    
    // Reset steps
    AUTOML_STEPS.forEach(step => {
        const el = document.getElementById(step.id);
        if (el) {
            el.classList.remove('active', 'done');
            const icon = el.querySelector('i');
            if (icon) icon.className = 'fas fa-circle';
        }
    });
    
    // Execute steps
    let stepIndex = 0;
    const executeStep = () => {
        if (stepIndex >= AUTOML_STEPS.length) {
            console.log('✅ AutoML completed');
            setTimeout(() => {
                progressSection.style.display = 'none';
                dashboardResults.style.display = 'block';
                renderResults();
            }, CONFIG.STEP_DELAY);
            return;
        }
        
        const step = AUTOML_STEPS[stepIndex];
        updateProgressUI(step);
        
        setTimeout(() => {
            markStepComplete(step);
            stepIndex++;
            executeStep();
        }, CONFIG.STEP_DELAY + Math.random() * 200);
    };
    
    executeStep();
}

function updateProgressUI(step) {
    const title = document.getElementById('progressTitle');
    const percent = document.getElementById('progressPercent');
    const fill = document.getElementById('progressFill');
    const stepEl = document.getElementById(step.id);
    
    if (title) title.textContent = step.label;
    if (percent) percent.textContent = step.pct + '%';
    if (fill) fill.style.width = step.pct + '%';
    
    if (stepEl) {
        stepEl.classList.add('active');
        const icon = stepEl.querySelector('i');
        if (icon) icon.className = 'fas fa-spinner fa-spin';
    }
}

function markStepComplete(step) {
    const el = document.getElementById(step.id);
    if (el) {
        el.classList.remove('active');
        el.classList.add('done');
        const icon = el.querySelector('i');
        if (icon) icon.className = 'fas fa-check-circle';
    }
}

function renderResults() {
    console.log('📊 Rendering results for:', currentTask);
    
    const isClassification = currentTask === 'classification';
    const summaryData = isClassification
        ? { model: 'XGBoost', score: '96.8%', label: '準確率', features: 24, time: '12.4s' }
        : { model: 'LightGBM', score: '0.923', label: 'R² Score', features: 31, time: '8.7s' };
    
    // Update summary
    const updates = {
        bestModel: summaryData.model,
        bestScore: summaryData.score,
        metricLabel: summaryData.label,
        featureCount: summaryData.features,
        trainTime: summaryData.time,
        confusionTabLabel: isClassification ? '混淆矩陣' : '殘差分析'
    };
    
    Object.entries(updates).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
    
    // Render charts
    Object.values(charts).forEach(c => c?.destroy?.());
    charts = {};
    
    renderPerformanceChart(isClassification);
    renderImportanceChart(isClassification);
    renderConfusionChart(isClassification);
    renderLearningChart(isClassification);
    renderHyperoptChart(isClassification);
}

// ===== CHARTS =====
function renderPerformanceChart(isClassification) {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (!ctx) return;
    
    const models = ['XGBoost', 'LightGBM', 'CatBoost', 'Random Forest', 'SVM', 'Logistic/Linear'];
    const datasets = isClassification ? [
        { label: 'Accuracy', data: [0.968, 0.962, 0.955, 0.941, 0.912, 0.887], backgroundColor: CHART_COLORS.primary, borderRadius: 6, borderSkipped: false },
        { label: 'F1-Score', data: [0.954, 0.949, 0.940, 0.928, 0.895, 0.871], backgroundColor: CHART_COLORS.secondary, borderRadius: 6, borderSkipped: false },
        { label: 'AUC-ROC', data: [0.985, 0.981, 0.974, 0.959, 0.938, 0.905], backgroundColor: CHART_COLORS.success, borderRadius: 6, borderSkipped: false }
    ] : [
        { label: 'R² Score', data: [0.912, 0.923, 0.905, 0.887, 0.845, 0.812], backgroundColor: CHART_COLORS.primary, borderRadius: 6, borderSkipped: false },
        { label: '1 - RMSE (norm)', data: [0.934, 0.941, 0.921, 0.898, 0.867, 0.834], backgroundColor: CHART_COLORS.secondary, borderRadius: 6, borderSkipped: false },
        { label: '1 - MAE (norm)', data: [0.945, 0.952, 0.932, 0.912, 0.878, 0.851], backgroundColor: CHART_COLORS.success, borderRadius: 6, borderSkipped: false }
    ];
    
    charts.performance = new Chart(ctx, {
        type: 'bar',
        data: { labels: models, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${c.raw.toFixed(3)}` } } },
            scales: { y: { beginAtZero: false, min: 0.7, max: 1.0, grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => v.toFixed(2) } }, x: { grid: { display: false } } }
        }
    });
}

function renderImportanceChart(isClassification) {
    const ctx = document.getElementById('importanceChart')?.getContext('2d');
    if (!ctx) return;
    
    const features = isClassification
        ? ['信用額度', '還款狀態', '帳單金額', '年齡', '教育程度', '婚姻狀態', '逾期次數', '收入區間', '消費比率', '帳戶年資']
        : ['建坪面積', '地段評級', '屋齡', '衛浴數量', '車庫面積', '建材等級', '樓層數', '學區評分', '裝修年份', '鄰里均價'];
    const importances = [0.186, 0.158, 0.132, 0.104, 0.089, 0.078, 0.072, 0.065, 0.059, 0.057];
    
    charts.importance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Feature Importance (SHAP)',
                data: importances,
                backgroundColor: importances.map((v, i) => `rgba(99, 102, 241, ${0.4 + (1 - i / importances.length) * 0.6})`),
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` 重要性: ${(c.raw * 100).toFixed(1)}%` } } },
            scales: { x: { grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => (v * 100).toFixed(0) + '%' } }, y: { grid: { display: false } } }
        }
    });
}

function renderConfusionChart(isClassification) {
    const confusionChart = document.getElementById('confusionChart');
    const residualChart = document.getElementById('residualChart');
    
    if (!confusionChart || !residualChart) return;
    
    if (isClassification) {
        confusionChart.style.display = 'block';
        residualChart.style.display = 'none';
        
        const ctx = confusionChart.getContext('2d');
        charts.confusion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['True Positive (892)', 'False Negative (31)', 'False Positive (24)', 'True Negative (1053)'],
                datasets: [{
                    data: [892, 31, 24, 1053],
                    backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(99, 102, 241, 0.7)'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: '混淆矩陣 — XGBoost (Accuracy: 96.8%)', font: { size: 14, weight: '600' }, color: '#e2e8f0', padding: { bottom: 20 } },
                    tooltip: { callbacks: { label: (c) => ` 樣本數: ${c.raw}` } }
                },
                scales: { y: { grid: { color: 'rgba(99, 102, 241, 0.06)' }, beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    } else {
        confusionChart.style.display = 'none';
        residualChart.style.display = 'block';
        
        const residualData = [];
        for (let i = 0; i < 100; i++) {
            residualData.push({ x: 100000 + Math.random() * 400000, y: (Math.random() - 0.5) * 60000 });
        }
        
        const ctx = residualChart.getContext('2d');
        charts.confusion = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: [{ label: '殘差值', data: residualData, backgroundColor: 'rgba(99, 102, 241, 0.5)', pointRadius: 4, pointHoverRadius: 6 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: '殘差分析 — LightGBM (R²: 0.923)', font: { size: 14, weight: '600' }, color: '#e2e8f0', padding: { bottom: 20 } },
                    tooltip: { callbacks: { label: (c) => `預測: $${Math.round(c.raw.x).toLocaleString()}, 殘差: $${Math.round(c.raw.y).toLocaleString()}` } }
                },
                scales: {
                    x: { title: { display: true, text: '預測值', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' } },
                    y: { title: { display: true, text: '殘差', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' } }
                }
            }
        });
    }
}

function renderLearningChart(isClassification) {
    const ctx = document.getElementById('learningChart')?.getContext('2d');
    if (!ctx) return;
    
    const epochs = Array.from({ length: 20 }, (_, i) => i + 1);
    const trainScores = [], valScores = [];
    
    for (let i = 0; i < 20; i++) {
        const t = (i + 1) / 20;
        if (isClassification) {
            trainScores.push(0.82 + 0.17 * (1 - Math.exp(-3 * t)) + (Math.random() - 0.5) * 0.005);
            valScores.push(0.80 + 0.15 * (1 - Math.exp(-2.5 * t)) + (Math.random() - 0.5) * 0.008);
        } else {
            trainScores.push(0.65 + 0.30 * (1 - Math.exp(-3 * t)) + (Math.random() - 0.5) * 0.008);
            valScores.push(0.60 + 0.28 * (1 - Math.exp(-2.5 * t)) + (Math.random() - 0.5) * 0.012);
        }
    }
    
    charts.learning = new Chart(ctx, {
        type: 'line',
        data: {
            labels: epochs,
            datasets: [
                { label: '訓練集', data: trainScores, borderColor: CHART_COLORS.primary, backgroundColor: CHART_COLORS.primaryAlpha, fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2.5 },
                { label: '驗證集', data: valScores, borderColor: CHART_COLORS.secondary, backgroundColor: CHART_COLORS.secondaryAlpha, fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2.5 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: isClassification ? '學習曲線 — XGBoost (Accuracy)' : '學習曲線 — LightGBM (R² Score)', font: { size: 14, weight: '600' }, color: '#e2e8f0', padding: { bottom: 20 } } },
            scales: {
                x: { title: { display: true, text: 'Boosting Rounds (×50)', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' } },
                y: { title: { display: true, text: isClassification ? 'Accuracy' : 'R² Score', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => v.toFixed(2) } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function renderHyperoptChart(isClassification) {
    const ctx = document.getElementById('hyperoptChart')?.getContext('2d');
    if (!ctx) return;
    
    const trials = 50, trialNums = Array.from({ length: trials }, (_, i) => i + 1);
    const scores = [], bestScores = [];
    let bestSoFar = 0;
    
    for (let i = 0; i < trials; i++) {
        const base = isClassification ? 0.90 : 0.82;
        const score = Math.min(base + (1 - Math.exp(-0.08 * i)) * (isClassification ? 0.07 : 0.12) + (Math.random() - 0.5) * 0.03, isClassification ? 0.975 : 0.935);
        scores.push(score);
        bestSoFar = Math.max(bestSoFar, score);
        bestScores.push(bestSoFar);
    }
    
    charts.hyperopt = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trialNums,
            datasets: [
                {
                    label: '各次嘗試分數',
                    data: scores,
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    pointBackgroundColor: scores.map((s, i) => s === bestScores[i] && (i === 0 || bestScores[i] > bestScores[i - 1]) ? CHART_COLORS.accent : CHART_COLORS.primary),
                    pointRadius: scores.map((s, i) => s === bestScores[i] && (i === 0 || bestScores[i] > bestScores[i - 1]) ? 5 : 2.5),
                    fill: true,
                    tension: 0.1,
                    borderWidth: 1.5,
                    pointHoverRadius: 6
                },
                { label: '歷史最佳', data: bestScores, borderColor: CHART_COLORS.success, borderWidth: 2.5, borderDash: [6, 3], pointRadius: 0, pointHoverRadius: 4, fill: false, tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: `超參數優化歷程 — Optuna (${trials} trials)`, font: { size: 14, weight: '600' }, color: '#e2e8f0', padding: { bottom: 20 } },
                tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${c.raw.toFixed(4)}` } }
            },
            scales: {
                x: { title: { display: true, text: 'Trial #', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' } },
                y: { title: { display: true, text: isClassification ? 'Accuracy' : 'R² Score', color: '#94a3b8' }, grid: { color: 'rgba(99, 102, 241, 0.06)' }, ticks: { callback: v => v.toFixed(3) } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

// Chart.js config
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', 'Noto Sans TC', sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 20;
