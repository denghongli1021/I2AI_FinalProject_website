/**
 * AutoML 平台 - 主要應用邏輯
 * 包含視圖導航、圖表初始化、前端交互等功能
 */

// ============================================
// 1. 視圖導航系統
// ============================================

class ViewManager {
    constructor() {
        this.currentView = 'dashboard';
        this.initNavigation();
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // 隱藏所有視圖
        const containers = document.querySelectorAll('.view-container');
        containers.forEach(container => {
            container.classList.remove('active');
        });

        // 移除所有活躍導覽項
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // 顯示選定的視圖
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // 標記活躍導覽項
        const targetNav = document.querySelector(`[data-view="${viewName}"]`);
        if (targetNav) {
            targetNav.classList.add('active');
        }

        // 更新麵包屑
        const pageNameMap = {
            dashboard: '儀表板',
            datasets: '數據集管理',
            experiments: '實驗室',
            leaderboard: '模型排行榜',
            insights: '洞察與決策',
            deployments: '部署與 API'
        };

        document.getElementById('currentPage').textContent = pageNameMap[viewName] || viewName;
        this.currentView = viewName;

        // 初始化圖表（如果需要）
        this.initChartsForView(viewName);
    }

    initChartsForView(viewName) {
        switch (viewName) {
            case 'experiments':
                setTimeout(() => {
                    ChartManager.initPipelineChart();
                }, 100);
                break;
            case 'insights':
                setTimeout(() => {
                    ChartManager.initFeatureImportanceChart();
                    ChartManager.initShapWaterfallChart();
                }, 100);
                break;
        }
    }
}

// ============================================
// 2. 圖表管理系統
// ============================================

class ChartManager {
    static initPipelineChart() {
        const container = document.getElementById('pipeline-chart');
        if (!container) return;

        const myChart = echarts.init(container);
        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                borderColor: '#333',
                textStyle: { color: '#fff' }
            },
            series: [
                {
                    type: 'sankey',
                    data: [
                        { name: '原始數據' },
                        { name: '數據清洗' },
                        { name: '特徵工程' },
                        { name: 'XGBoost' },
                        { name: 'LightGBM' },
                        { name: 'Random Forest' },
                        { name: '模型評估' },
                        { name: '最佳模型' }
                    ],
                    links: [
                        { source: '原始數據', target: '數據清洗', value: 100 },
                        { source: '數據清洗', target: '特徵工程', value: 100 },
                        { source: '特徵工程', target: 'XGBoost', value: 35 },
                        { source: '特徵工程', target: 'LightGBM', value: 33 },
                        { source: '特徵工程', target: 'Random Forest', value: 32 },
                        { source: 'XGBoost', target: '模型評估', value: 35 },
                        { source: 'LightGBM', target: '模型評估', value: 33 },
                        { source: 'Random Forest', target: '模型評估', value: 32 },
                        { source: '模型評估', target: '最佳模型', value: 35 }
                    ],
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5,
                        opacity: 0.4
                    },
                    label: {
                        color: '#333',
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 2
                    },
                    levels: [
                        { depth: 0, itemStyle: { color: '#1e40af' } },
                        { depth: 1, itemStyle: { color: '#3b82f6' } },
                        { depth: 2, itemStyle: { color: '#60a5fa' } },
                        { depth: 3, itemStyle: { color: '#93c5fd' } }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    }

    static initFeatureImportanceChart() {
        const container = document.getElementById('feature-importance-chart');
        if (!container) return;

        const myChart = echarts.init(container);
        const option = {
            tooltip: { trigger: 'axis' },
            grid: {
                left: '20%',
                right: '10%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: [
                    '客戶終身價值',
                    '購買頻率',
                    '平均訂單金額',
                    '最後購買日期',
                    '客戶年齡',
                    '客戶地區',
                    '營銷郵件點擊率',
                    '產品評價分數',
                    '退貨次數',
                    '會員等級'
                ]
            },
            series: [
                {
                    data: [0.892, 0.764, 0.658, 0.512, 0.487, 0.456, 0.423, 0.387, 0.321, 0.267],
                    type: 'bar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                            { offset: 0, color: '#3b82f6' },
                            { offset: 1, color: '#60a5fa' }
                        ])
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}'
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    static initShapWaterfallChart() {
        const container = document.getElementById('shap-waterfall-chart');
        if (!container) return;

        const myChart = echarts.init(container);
        const option = {
            tooltip: { trigger: 'axis' },
            grid: {
                left: '15%',
                right: '15%',
                bottom: '15%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [
                    '基線值',
                    '購買頻率',
                    '客戶等級',
                    '最近購買',
                    '訂單金額',
                    '地區因素',
                    '年齡因素',
                    '預測結果'
                ]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [0, 0.154, 0.123, 0.098, 0.076, -0.045, 0.032, 0],
                    type: 'bar',
                    stack: 'Total',
                    itemStyle: {
                        color: function (params) {
                            if (params.value > 0) return '#10b981';
                            if (params.value < 0) return '#ef4444';
                            return '#94a3b8';
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
}

// ============================================
// 3. 互動式 What-If 模擬器
// ============================================

class WhatsIfSimulator {
    constructor() {
        this.sliders = {
            budget: document.getElementById('budget-slider'),
            delivery: document.getElementById('delivery-slider'),
            satisfaction: document.getElementById('satisfaction-slider'),
            price: document.getElementById('price-slider')
        };

        this.resultDisplay = document.getElementById('prediction-result');
        this.suggestionDisplay = document.getElementById('decision-suggestion');

        this.initSliders();
        this.updatePrediction();
    }

    initSliders() {
        Object.entries(this.sliders).forEach(([key, slider]) => {
            if (slider) {
                slider.addEventListener('input', () => {
                    this.updateSliderValue(slider);
                    this.updatePrediction();
                });
            }
        });
    }

    updateSliderValue(slider) {
        const value = slider.value;
        const label = slider.parentElement.querySelector('.slider-value');
        
        if (slider.id === 'budget-slider') {
            label.textContent = `${value}%`;
        } else if (slider.id === 'delivery-slider') {
            label.textContent = `${value} 天`;
        } else if (slider.id === 'satisfaction-slider') {
            label.textContent = `${(value / 10).toFixed(1)}`;
        } else if (slider.id === 'price-slider') {
            label.textContent = `$${value}`;
        }
    }

    updatePrediction() {
        const budget = parseFloat(this.sliders.budget.value) || 0;
        const delivery = parseFloat(this.sliders.delivery.value) || 0;
        const satisfaction = parseFloat(this.sliders.satisfaction.value) || 0;
        const price = parseFloat(this.sliders.price.value) || 0;

        // 簡化的預測模型（示例）
        let prediction = 0.50; // 基線值
        
        // 行銷預算的影響
        prediction += (budget / 100) * 0.25;
        
        // 交貨時間的影響（延遲會降低購買機率）
        prediction -= (Math.abs(delivery) / 10) * 0.1;
        
        // 客戶滿意度的影響
        prediction += (satisfaction / 10) * 0.2;
        
        // 價格的影響（高價會降低購買機率）
        prediction -= (Math.abs(price - 100) / 200) * 0.15;

        // 確保在 0-1 之間
        prediction = Math.max(0, Math.min(1, prediction));

        // 更新顯示
        const percentage = Math.round(prediction * 100);
        this.resultDisplay.textContent = `${percentage}%`;

        // 生成建議
        this.generateSuggestion(percentage, budget, delivery, satisfaction, price);
    }

    generateSuggestion(percentage, budget, delivery, satisfaction, price) {
        let suggestion = '';

        if (percentage < 50) {
            if (budget < 40) {
                suggestion = '💡 建議增加行銷預算以提高品牌認知度。';
            } else if (delivery > 2) {
                suggestion = '💡 建議縮短交貨時間，這會顯著提高購買機率。';
            } else if (satisfaction < 5) {
                suggestion = '💡 建議改進產品品質或服務，提升客戶滿意度。';
            } else {
                suggestion = '💡 建議考慮降低產品價格以提高競爭力。';
            }
        } else if (percentage < 75) {
            suggestion = '✓ 當前條件下，購買機率良好。可考慮微調行銷策略。';
        } else {
            suggestion = '🎉 優異的購買機率！這是理想的銷售條件，建議立即執行。';
        }

        this.suggestionDisplay.textContent = suggestion;
    }
}

// ============================================
// 4. 活動日誌系統
// ============================================

class ActivityLogger {
    static log(type, message, timestamp = new Date()) {
        const activity = {
            type: type, // 'success', 'info', 'warning', 'error'
            message: message,
            timestamp: timestamp
        };
        console.log(`[${type}] ${message}`);
    }

    static logModelCompletion(model, score) {
        this.log('success', `${model} 模型訓練完成，得分: ${score}`);
    }

    static logDataProcessing(operation, percentage) {
        this.log('info', `${operation} 已完成，${percentage}% 的數據已處理`);
    }
}

// ============================================
// 5. 實驗配置管理
// ============================================

class ExperimentManager {
    constructor() {
        this.experiments = [];
        this.selectedDataset = null;
        this.targetVariable = null;
        this.initFormListeners();
    }

    initFormListeners() {
        const datasetSelect = document.querySelector('.experiment-form-card select');
        if (datasetSelect) {
            datasetSelect.addEventListener('change', (e) => {
                this.selectedDataset = e.target.value;
            });
        }

        const targetSelect = document.querySelectorAll('.experiment-form-card select')[1];
        if (targetSelect) {
            targetSelect.addEventListener('change', (e) => {
                this.targetVariable = e.target.value;
            });
        }

        // 訓練開始按鈕
        const startBtn = document.querySelector('.experiment-form-card .btn-success');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startExperiment();
            });
        }
    }

    startExperiment() {
        if (!this.selectedDataset || !this.targetVariable) {
            alert('請選擇數據集和目標變數');
            return;
        }

        alert(`✓ 實驗已開始！\n數據集: ${this.selectedDataset}\n目標變數: ${this.targetVariable}\n\n系統將自動進行數據清洗、特徵工程和模型訓練...`);
        ActivityLogger.logDataProcessing('數據預處理', 0);
    }
}

// ============================================
// 6. 初始化函數
// ============================================

function initializeApp() {
    // 初始化視圖管理器
    const viewManager = new ViewManager();

    // 初始化 What-If 模擬器
    const simulator = new WhatsIfSimulator();

    // 初始化實驗管理器
    const experimentManager = new ExperimentManager();

    // 紀錄應用啟動
    ActivityLogger.log('info', 'AutoML 平台已啟動');

    // 為所有按鈕添加點擊回饋
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('部署') || this.textContent.includes('上線')) {
                alert('✓ 操作已提交！模型即將部署...');
            } else if (this.textContent.includes('下架')) {
                alert('⚠️ 確認下架模型？此操作無法撤銷。');
            }
        });
    });
}

// ============================================
// 7. DOM 就緒後初始化
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
