// ==================== 全局应用配置 ====================

const CONFIG = {
    AUTO_SCROLL_DURATION: 300,
    TRAINING_DURATION: 60000, // 60秒模拟训练
    CHART_ANIMATION_DURATION: 800,
    MODULE_TRANSITION_DURATION: 300,
};

const CHART_COLORS = {
    primary: '#00d4ff',
    secondary: '#7c3aed',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    shades: ['#00d4ff', '#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'],
};

// ==================== DOM 缓存 ====================

const DOM = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('navMenu'),
    navToggle: document.getElementById('navToggle'),
    navItems: document.querySelectorAll('.nav-item'),
    modules: document.querySelectorAll('.module'),
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    modePanels: document.querySelectorAll('.mode-panel'),
    trainingProgress: document.getElementById('trainingProgress'),
    progressModal: document.getElementById('progressModal'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    progressDetails: document.getElementById('progressDetails'),
    modeSliders: document.querySelectorAll('.simulator-slider'),
    sampleSelect: document.getElementById('sampleSelect'),
};

// ==================== 初始化应用 ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ App initialized');
    
    // 注册事件监听器
    registerNavigationListeners();
    registerUploadListeners();
    registerModeListeners();
    registerAutoMLListeners();
    registerSimulatorListeners();
    registerChartListeners();
    
    // 初始化图表
    initializeCharts();
});

// ==================== 导航模块 ====================

function registerNavigationListeners() {
    // 导航菜单切换
    DOM.navToggle?.addEventListener('click', () => {
        DOM.navMenu?.classList.toggle('active');
    });

    // 导航项点击
    DOM.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleId = item.dataset.module;
            switchModule(moduleId);
            DOM.navMenu?.classList.remove('active');
        });
    });
}

function switchModule(moduleId) {
    if (!moduleId) {
        console.warn('⚠ Invalid module ID');
        return;
    }

    // 隐藏所有模块
    DOM.modules.forEach(module => {
        module.classList.add('hidden');
    });

    // 显示选定模块
    const targetModule = document.getElementById(`${moduleId}-module`);
    if (targetModule) {
        targetModule.classList.remove('hidden');
    }

    // 更新导航项状态
    DOM.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.module === moduleId);
    });

    // 记录日志
    console.log(`✓ Switched to module: ${moduleId}`);
}

// ==================== 上传模块 ====================

function registerUploadListeners() {
    if (!DOM.uploadZone) return;

    // 拖拽上传
    DOM.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.uploadZone.style.background = 'rgba(0, 212, 255, 0.1)';
    });

    DOM.uploadZone.addEventListener('dragleave', () => {
        DOM.uploadZone.style.background = '';
    });

    DOM.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.uploadZone.style.background = '';
        
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    // 点击上传
    DOM.uploadZone.addEventListener('click', () => {
        DOM.fileInput?.click();
    });

    DOM.fileInput?.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });
}

function handleFileUpload(files) {
    if (!files || files.length === 0) {
        console.warn('⚠ No files selected');
        return;
    }

    Array.from(files).forEach(file => {
        console.log(`✓ File uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        if (file.type.includes('csv') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx')) {
            // 模拟文件处理
            simulateFileProcessing(file);
        } else {
            console.warn(`⚠ Unsupported file type: ${file.type}`);
        }
    });
}

function simulateFileProcessing(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log(`✓ File processed: ${file.name}`);
    };
    reader.readAsText(file);
}

// ==================== AutoML 模块 ====================

function registerModeListeners() {
    DOM.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });
}

function switchMode(mode) {
    // 更新按钮状态
    DOM.modeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // 更新面板状态
    DOM.modePanels.forEach(panel => {
        const isHidden = panel.id !== `${mode}-mode`;
        panel.classList.toggle('hidden', isHidden);
    });

    console.log(`✓ Switched to ${mode} mode`);
}

function registerAutoMLListeners() {
    // 向导步骤导航
    const wizardSteps = document.querySelectorAll('.wizard-step');
    if (wizardSteps.length > 0) {
        // 自动显示第一步
        if (wizardSteps[0]) {
            wizardSteps[0].classList.add('active');
        }
    }
}

function startAutoML() {
    console.log('✓ Starting AutoML training...');
    
    // 显示训练进度
    DOM.trainingProgress?.classList.remove('hidden');
    DOM.progressModal?.classList.remove('hidden');

    // 模拟训练步骤
    simulateTraining();
}

function simulateTraining() {
    const steps = [
        '初始化系統...',
        '讀取資料...',
        '探索性數據分析...',
        '特徵工程...',
        '模型選擇...',
        '超參數調整...',
        '交叉驗證...',
        '最終評估...',
        '生成報告...',
    ];

    let stepIndex = 0;
    let elapsedSeconds = 0;
    const totalDuration = CONFIG.TRAINING_DURATION / 1000;

    const interval = setInterval(() => {
        elapsedSeconds += 0.5;
        
        // 更新進度條
        const progress = (elapsedSeconds / totalDuration) * 100;
        if (DOM.progressFill) {
            DOM.progressFill.style.width = Math.min(progress, 100) + '%';
        }

        // 更新當前步驟
        if (stepIndex < steps.length) {
            if (DOM.progressText) {
                DOM.progressText.textContent = steps[stepIndex];
            }
            
            if (elapsedSeconds % (totalDuration / steps.length) < 0.5) {
                stepIndex++;
            }
        }

        // 完成訓練
        if (elapsedSeconds >= totalDuration) {
            clearInterval(interval);
            finishTraining();
        }
    }, 500);
}

function finishTraining() {
    console.log('✓ Training completed!');
    
    if (DOM.progressText) {
        DOM.progressText.textContent = '訓練完成! 最佳模型: XGBoost v3 (準確率: 94.7%)';
    }

    // 2秒後隱藏模態
    setTimeout(() => {
        DOM.progressModal?.classList.add('hidden');
    }, 2000);
}

// ==================== What-If 模拟器 ====================

function registerSimulatorListeners() {
    DOM.modeSliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            const label = e.target.parentElement.querySelector('.slider-value');
            
            if (label) {
                if (e.target.id.includes('quality')) {
                    label.textContent = `${value}/10`;
                } else if (e.target.id.includes('discount')) {
                    label.textContent = `${value}%`;
                } else {
                    label.textContent = `${value}%`;
                }
            }

            // 更新模拟结果
            updateSimulationResults();
        });
    });

    // 样本选择
    DOM.sampleSelect?.addEventListener('change', () => {
        updateWaterfallExplanation();
    });
}

function updateSimulationResults() {
    console.log('✓ Updating simulation results...');
    
    // 计算新的模拟结果
    const results = calculateSimulationMetrics();
    
    // 更新显示的结果
    const resultBoxes = document.querySelectorAll('.result-box');
    if (resultBoxes.length > 0) {
        resultBoxes.forEach((box, index) => {
            const value = box.querySelector('.result-value');
            if (value) {
                value.textContent = results[index];
            }
        });
    }

    // 更新 What-If 图表
    updateWhatIfChart();
}

function calculateSimulationMetrics() {
    // 模拟计算（简化版本）
    return [
        `+${(Math.random() * 50).toFixed(1)}%`,
        `${(5 + Math.random() * 5).toFixed(1)}/10`,
        `${(2 + Math.random() * 5).toFixed(1)}%`,
        `${(200 + Math.random() * 500).toFixed(0)}%`,
    ];
}

function updateWaterfallExplanation() {
    console.log('✓ Updated waterfall explanation');
    // 这里可以添加动态更新瀑布图的逻辑
}

// ==================== 图表模块 ====================

let charts = {};

function registerChartListeners() {
    // 选项卡切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log(`✓ Tab switched: ${btn.textContent}`);
        });
    });
}

function initializeCharts() {
    // SHAP 重要性图
    createShapChart();
    
    // 超参数优化图
    createHyperoptChart();
    
    // PDP 图
    createPDPChart();
    
    // What-If 图
    createWhatIfChart();
}

function createShapChart() {
    const ctx = document.getElementById('shap-chart');
    if (!ctx) {
        console.warn('⚠ SHAP chart canvas not found');
        return;
    }

    charts.shap = new Chart(ctx, {
        type: 'barh',
        data: {
            labels: ['消費金額', '帳戶年資', '購買頻度', '客服評分', '促銷回應率'],
            datasets: [{
                label: 'SHAP 重要性',
                data: [85, 72, 68, 55, 42],
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.info,
                    CHART_COLORS.secondary,
                    CHART_COLORS.success,
                    CHART_COLORS.warning,
                ],
                borderRadius: 4,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#a0aec0' },
                },
                y: {
                    ticks: { color: '#a0aec0' },
                },
            },
        },
    });

    console.log('✓ SHAP chart initialized');
}

function createHyperoptChart() {
    const ctx = document.getElementById('hyperoptChart');
    if (!ctx) {
        console.warn('⚠ Hyperopt chart canvas not found');
        return;
    }

    // 模拟超参数优化数据
    const data = Array.from({ length: 50 }, (_, i) => ({
        x: i + 1,
        y: 85 + Math.random() * 10 - 2 * Math.sqrt(i),
    }));

    charts.hyperopt = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `試驗 ${d.x}`),
            datasets: [{
                label: '模型性能',
                data: data.map(d => d.y),
                borderColor: CHART_COLORS.primary,
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#a0aec0' },
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 75,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#a0aec0' },
                },
                x: {
                    ticks: { color: '#a0aec0' },
                },
            },
        },
    });

    console.log('✓ Hyperopt chart initialized');
}

function createPDPChart() {
    const ctx = document.getElementById('pdpChart');
    if (!ctx) {
        console.warn('⚠ PDP chart canvas not found');
        return;
    }

    charts.pdp = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0', '20', '40', '60', '80', '100'],
            datasets: [{
                label: '部分依賴',
                data: [0.2, 0.35, 0.55, 0.75, 0.85, 0.9],
                borderColor: CHART_COLORS.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                fill: true,
                pointBackgroundColor: CHART_COLORS.success,
                pointBorderColor: '#fff',
                pointRadius: 5,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#a0aec0' },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#a0aec0' },
                },
                x: {
                    ticks: { color: '#a0aec0' },
                },
            },
        },
    });

    console.log('✓ PDP chart initialized');
}

function createWhatIfChart() {
    const ctx = document.getElementById('whatIfChart');
    if (!ctx) {
        console.warn('⚠ What-If chart canvas not found');
        return;
    }

    charts.whatif = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['營收增長', '客戶滿意度', '客戶保留', '投資回報', '市場佔有率'],
            datasets: [
                {
                    label: '當前狀態',
                    data: [65, 65, 70, 60, 55],
                    borderColor: CHART_COLORS.info,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                },
                {
                    label: '模擬方案',
                    data: [85, 80, 88, 92, 78],
                    borderColor: CHART_COLORS.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#a0aec0' },
                },
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#a0aec0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                },
            },
        },
    });

    console.log('✓ What-If chart initialized');
}

function updateWhatIfChart() {
    if (!charts.whatif) {
        console.warn('⚠ What-If chart not initialized');
        return;
    }

    // 更新第二个数据集（模拟方案）
    charts.whatif.data.datasets[1].data = [
        85 + Math.random() * 15,
        80 + Math.random() * 15,
        88 + Math.random() * 10,
        92 + Math.random() * 5,
        78 + Math.random() * 15,
    ];

    charts.whatif.update();
}

// ==================== 工具函数 ====================

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // 这里可以添加通知UI
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// 响应式菜单处理
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && DOM.navMenu) {
        DOM.navMenu.classList.remove('active');
    }
});

console.log('✓ All modules registered');
