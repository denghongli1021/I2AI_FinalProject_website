# 智能預測與決策支援平台 (AI Decision Support Platform) - v2.0

## 📋 概述

這是一個企業級的 **AutoML + XAI 決策支援平台**，包含4個核心模組，旨在將複雜的機器學習過程簡化為可視化、可交互的體驗。

### 核心特性
- 🚀 **一鍵 AutoML 訓練** - 自動特徵工程與超參數優化
- 🔍 **XAI 可解釋性** - SHAP、LIME、瀑布圖説明模型決策
- 🎯 **What-If 決策模擬** - 互動式決策分析
- 📊 **即時進度反饋** - 排行榜、metrics 動態更新
- 🌐 **企業UI/UX** - 響應式、深色主題、無障礙設計

---

## 📁 項目結構

```
version2/
├── index.html                   # 主應用入口 (4個模組)
├── css/
│   └── style.css               # 企業級樣式 (CSS Variables, Grid, Flexbox)
├── js/
│   ├── app.js                  # 核心應用邏輯 (事件處理、圖表渲染)
│   └── modules/                # 可擴展的模組系統
│       ├── dataModule.js       # [未來] 資料匯入與探索
│       ├── automlModule.js     # [未來] AutoML 引擎
│       ├── xaiModule.js        # [未來] 可解釋性分析
│       └── decisionModule.js   # [未來] 決策支援爲集
└── data/
    └── sample-data.json        # [未來] 示例資料
```

---

## 🎯 4個核心模組

### 模組 1: 資料中樞 (Data Hub)
**功能**: 上傳、預覽、探索您的數據
- 📤 拖放檔案上傳 (CSV, Excel, JSON)
- 📋 資料網格預覽 (可回捲、可分頁)
- 📊 自動統計資訊 (行數、列數、缺失值率)
- ⏱️ 時間序列檢測
- 🔧 資料配置 (目標變數、測試集分割)

**技術棧**: 
- Drag-Drop API
- FileReader API
- HTML5 Tables

---

### 模組 2: AutoML 實驗室 (AutoML Studio)
**功能**: 自動化機器學習訓練
- 🧙 **向導模式** - 適合初學者 (3步驟流程)
- 🔬 **專家模式** - 進階用戶 (演算法選擇、超參數調整)
- 🏆 **即時排行榜** - 最佳模型展示 (Golden badge)
- 📈 **超參數優化曲線** - 歷史進度視覺化
- ⏱️ **進度追蹤** - "Trial 45/100"、"Epoch 23/50"

**支持的演算法**: 
- XGBoost, LightGBM, CatBoost
- Random Forest, SVM
- Neural Networks, LSTM

**後端對接點** (未來):
```
POST /api/automl/train
{
  "dataset": "cus_001",
  "task": "classification",
  "metric": "accuracy",
  "time_limit": 60,  // 分鐘
  "algorithms": ["xgboost", "lightgbm"]
}
```

---

### 模組 3: XAI 可解釋性儀表板
**功能**: 理解模型決策邏輯
- 🌍 **全局 SHAP** - 特徵重要性排行
- 📊 **瀑布圖** - 單筆預測分解 (基準 → 特徵貢獻 → 最終預測)
- 📉 **部分依賴圖 (PDP)** - 特徵邊際效應
- 🔬 **LIME 本地解釋** - 決策邊界說明

**典型用場景**:
- 銀行: "為什麼客戶被拒貸?" → 瀑布圖展示
- 電商: "推薦這個產品原因?" → SHAP 特徵排序
- 醫療: "這個診斷的置信度?" → LIME 風險因子

---

### 模組 4: 決策支援與 What-If 分析
**功能**: 模擬決策方案，優化策略
- 🎚️ **互動式滑塊** - 實時調整參數
- 📊 **雷達圖對比** - 當前方案 vs 模擬方案
- ⚠️ **風險預警清單** - 客戶分層 (高/中/低風險)
- 💡 **AI 策略建議** - 客戶分群、個性化推薦、動態定價

**導出功能**:
- Excel 風險清單
- PDF 決策報告
- 行動建議清單

---

## 🔧 技術架構

### 前端 (已實現)
```
Frontend (Vanilla JavaScript)
├── HTML5 Semantic Structure
├── CSS3 Grid + Flexbox + Variables
├── Chart.js (5個圖表)
├── Drag-Drop + File APIs
└── Event Delegation + DOM Caching
```

### 後端整合說明 (推薦架構)

#### 方案 A: FastAPI + Celery (推薦)
```python
# FastAPI 服務器 (port 8000)
from fastapi import FastAPI, WebsocketManager
from celery import Celery

app = FastAPI()
celery_app = Celery('tasks', broker='redis://localhost:6379')

@app.post("/api/automl/train")
async def start_training(config: TrainingConfig):
    # 提交異步訓練任務
    task_id = celery_app.send_task('train_model', (config,))
    return {"task_id": task_id}

@app.websocket("/ws/progress/{task_id}")
async def progress_updates(websocket, task_id):
    # WebSocket 即時推送進度
    while True:
        status = get_celery_task_status(task_id)
        await websocket.send_json(status)
```

#### 前端對接
```javascript
// 連結後端 WebSocket
const ws = new WebSocket('ws://localhost:8000/ws/progress/task_123');
ws.onmessage = (event) => {
    const { trial, best_score, status } = JSON.parse(event.data);
    updateLeaderboard(trial, best_score);
};
```

### 完整架構圖
```
┌─────────────────────────────────────────────────────┐
│                  前端 (version2)                     │
│  HTML | CSS | JS (Chart.js, DOM Caching)           │
│  └─ 4 個模組 | 響應式 | 深色主題                     │
└────────────────┬────────────────────────────────────┘
                 │ REST API + WebSocket
┌────────────────↓────────────────────────────────────┐
│            後端 (FastAPI)                           │
│       /api/automl/train                             │
│       /api/xai/explain                              │
│       /api/decision/simulate                        │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────↓────────────────────────────────────┐
│          ML 引擎 (Celery Workers)                   │
│  task_train_model.py (XGBoost, LightGBM, etc.)    │
│  task_explain_model.py (SHAP, LIME)               │
│  task_simulate_scenario.py (What-If)              │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────↓────────────────────────────────────┐
│           資料與模型存儲                            │
│  PostgreSQL (訓練紀錄) + S3 (模型檔)              │
│  Redis (隊列與快取)                                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 快速開始

### 1. 本地開發 (前端只)

```bash
# 進入目錄
cd version2/

# 啟動簡易 HTTP 伺服器
python -m http.server 8000

# 打開瀏覽器
# http://localhost:8000
```

### 2. 連結後端 (需要 FastAPI)

```bash
# 環境設置
pip install fastapi uvicorn celery redis scikit-learn xgboost pandas

# 啟動後端服務
cd backend/
python -m uvicorn main:app --reload --port 8000

# 啟動 Celery Worker
celery -A tasks worker --loglevel=info

# 啟動前端 (另一個終端)
cd ../version2/
python -m http.server 8001
# 訪問 http://localhost:8001
```

### 3. Docker 部署 (推薦)

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app

# 後端依賴
RUN pip install fastapi uvicorn celery redis

# 複製應用
COPY backend/ /app/backend/
COPY version2/ /app/version2/

# 啟動
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📊 使用案例

### 案例 1: 客戶流失預測
1. **資料中樞** → 上傳客戶歷史交易數據 (10,000 筆)
2. **AutoML** → 訓練分類模型 (XGBoost 獲勝: 94.7% AUC)
3. **XAI** → 發現 "帳戶年資" 是最重要特徵
4. **決策** → What-If: "如果增加服務品質評分到 8 分?"
   - 預期客戶留存率 +15%

### 案例 2: 營收預測
1. **資料中樞** → 時間序列數據 (2年月度營收)
2. **AutoML** → 訓練 LSTM 模型 (RMSE: $50K)
3. **XAI** → SHAP 顯示季節性因素影響最大
4. **決策** → 導出對下季度的風險預警

---

## 🎨 UI/UX 特點

### 深色主題
- **背景** 藍紫漸層 (`#0f1419` → `#1a1f2e`)
- **強調** 青藍色 (`#00d4ff`)，帶玻璃態背景混合

### 響應式設計
- **桌面** (1400px): 完整 4 欄網格
- **平板** (768px): 2 欄布局
- **手機** (480px): 單欄堆疊

### 無障礙
- 語意化 HTML (`<nav>`, `<main>`, `<section>`)
- 鍵盤導航 (Tab, Enter)
- 高對比文字 (WCAG AA)

---

## 🔮 未來改進方向

### 短期 (v2.1)
- [ ] 連結真實 FastAPI 後端
- [ ] 資料驗證與自動清洗
- [ ] 特徵工程 UI (衍生變數編輯器)

### 中期 (v2.2)
- [ ] 模型版本管理
- [ ] A/B 測試支援
- [ ] 協作注釋 (團隊評論模型)

### 長期 (v3.0)
- [ ] 模型市集 (預訓練模型下載)
- [ ] 聯邦學習支援
- [ ] 邊緣部署 (TensorFlow.js)

---

## 📝 API 文檔

### 資料相關

#### POST /api/data/upload
```json
請求:
{
  "file": File,
  "name": "customer_data"
}

響應:
{
  "dataset_id": "ds_001",
  "rows": 10000,
  "columns": 15,
  "preview": [...]
}
```

### AutoML 相關

#### POST /api/automl/train
```json
請求:
{
  "dataset_id": "ds_001",
  "task": "classification",
  "target": "is_churned",
  "time_limit": 60
}

響應:
{
  "experiment_id": "exp_001",
  "status": "running"
}
```

#### WebSocket /ws/progress/exp_001
```json
消息:
{
  "trial": 24,
  "total_trials": 100,
  "best_score": 0.947,
  "current_model": "XGBoost",
  "status": "training"
}
```

---

## 🐛 除錯提示

### 圖表不顯示？
```javascript
// 檢查 Chart.js 是否載入
console.log(Chart);  // 應輸出構造函數

// 檢查 canvas 元素
console.log(document.getElementById('shap-chart'));
```

### WebSocket 連結失敗？
```javascript
// 確認後端伺服器運行
// 檢查 CORS 設置
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

---

## 📚 參考資源

- **AutoML 框架**: [AutoGluon](https://auto.gluon.ai/), [H2O AutoML](https://h2o.ai/)
- **XAI 庫**: [SHAP](https://shap.readthedocs.io/), [LIME](https://lime-ml.readthedocs.io/)
- **前端**: [Chart.js](https://www.chartjs.org/), [Modern CSS](https://web.dev/)

---

## 📄 許可證

MIT License - 自由使用、修改與分發

---

## 👥 聯繫

問題或建議？歡迎提 Issue 或 Pull Request！

**祝您使用愉快！🚀**
