# Encrypted Note App

A secure, client-side encrypted note-taking application with **data stored directly in your Google Drive**. Users can create, view, and manage encrypted notes that can only be accessed with their personal password. Your data is completely under your control - no central server storage.

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Kan090808.github.io

# Install and run local server
npm install -g serve
serve .

# Open browser to http://localhost:3000
```

## How to Use

1. Clone and run locally (see Quick Start above)
2. Login with your Google account
3. Grant permissions for:
   - Google authentication (Firebase)
   - Google Drive access (to store encrypted notes)
4. Set up an encryption password
5. Create encrypted notes (up to 5000 characters each)
6. Notes are encrypted and automatically saved to your Google Drive
7. View and manage your encrypted notes anytime
8. Your data is always in YOUR Google Drive - never on any central server

## Architecture

- **Authentication**: Google OAuth via Firebase Auth
- **Storage**: Your personal Google Drive (user-controlled)
- **Encryption**: Client-side AES-256 with PBKDF2 key derivation
- **Deployment**: Run locally - no dependence on hosted server
- **Data Flow**: Browser → Encrypt → Your Google Drive (never stored elsewhere)

## Security Features

- **Your Data, Your Drive**: All notes stored in your personal Google Drive account
- **Client-Side Only**: All encryption/decryption happens entirely in your browser
- **Double Protection**: AES-256 encryption + Google Drive security
- **No Password Storage**: User passwords are never stored - only kept in memory
- **Password Re-entry**: Password must be entered after each page refresh
- **PBKDF2 Key Derivation**: Strengthens password security against brute-force attacks
- **Unique IVs**: Different outputs for identical notes (each encryption uses random IV)

## Encryption Process

1. **Password-Based Key Derivation**: Your password is transformed into a strong encryption key using PBKDF2, making brute-force attacks exponentially harder.
2. **Initialization Vector (IV) Generation**: A random IV is generated for each note encryption, ensuring identical notes produce different encrypted outputs.
3. **AES-256 Encryption**: Note content is encrypted using AES-256 with your derived key and generated IV.
4. **Upload to Drive**: The encrypted data is uploaded to your Google Drive (not to any central server).
5. **Decryption on Demand**: When viewing notes, decryption happens client-side using your password.

## Limitations

- Maximum 5000 characters per note
- Requires a Google account
- Password cannot be recovered if forgotten (by design - for security)
- Notes cannot be decrypted without the correct password
- Requires internet connection to sync with Google Drive
- Requires JavaScript enabled in browser

## Technologies Used

- **Google OAuth**: For secure user authentication
- **Google Drive API**: For storing encrypted notes in your personal Drive
- **Firebase Auth**: Lightweight authentication service
- **CryptoJS**: AES-256 encryption and PBKDF2 key derivation
- **HTML5 and CSS3**: Responsive user interface
- **Vanilla JavaScript**: Client-side logic without external dependencies

## Local Development Setup

### Prerequisites
- Git
- Node.js with npm
- A Google Cloud project with OAuth credentials

### Step 1: Clone Repository
```bash
git clone https://github.com/Kan090808/Kan090808.github.io.git
cd Kan090808.github.io
```

### Step 2: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable APIs:
   - Google Drive API
   - Identity and Access Management API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000`
     - `http://localhost:3000/callback`
5. Copy the Client ID and Client Secret

### Step 3: Create Firebase Project (for Auth only)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Google Authentication
4. Copy your Firebase configuration

### Step 4: Configure Local Environment

Create a `local-config.js` file in the root directory:

```javascript
function getFirebaseConfig() {
    return {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
}

function getGoogleOAuthConfig() {
    return {
        clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
        scopes: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.appdata'
        ]
    };
}
```

### Step 5: Install and Run

```bash
# Install serve globally
npm install -g serve

# Start development server
serve .

# Open browser
# http://localhost:3000
```

### Step 6: Load Google Drive API

The application will automatically load the Google Drive API when needed. First login will prompt you to authorize Google Drive access.

## File Structure

```
/
├── index.html              # Main application (HTML, CSS, JS combined)
├── style.css              # Application styles
├── config.js              # Production Firebase config (empty, uses env vars)
├── local-config.js        # Local development config (gitignored)
├── README.md              # This file
├── CLAUDE.md              # Developer documentation
├── .gitignore             # Git ignore rules
└── .github/workflows/
    └── static.yml         # GitHub Pages deployment (archived)
```

## How It Works: Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Your Computer                         │
├─────────────────────────────────────────────────────────┤
│  Browser                                                 │
│  ├─ index.html (loads all code)                          │
│  ├─ Encryption/Decryption (CryptoJS)                     │
│  └─ User password (kept in memory only)                  │
└──────────┬─────────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌──────────────────┐
│Firebase │  │  Your Google     │
│  Auth   │  │     Drive        │
└─────────┘  │  (Encrypted      │
             │   Notes Only)    │
             └──────────────────┘
```

## Privacy & Security Guarantees

✅ **Your password stays on your device** - Never sent to servers
✅ **Your notes are encrypted** - Only decryptable with your password
✅ **Your data is in your Drive** - You control the data, not us
✅ **No backend servers** - No central point of data collection
✅ **Open source** - Audit the code yourself
✅ **No ads or tracking** - Pure note-taking tool

## Limitations

- Maximum 5000 characters per note
- Requires a Google account
- Password cannot be recovered if forgotten (security by design)
- Notes cannot be decrypted without the correct password
- Requires internet connection for Drive sync
- Requires JavaScript enabled in browser
- Google Drive has storage limits (depends on account)

# 加密筆記應用

一個安全的客戶端加密筆記應用，**數據直接存儲在你的 Google Drive 中**。用戶可以創建、查看和管理只能通過個人密碼訪問的加密筆記。你的數據完全由你控制——不存儲在任何中央伺服器。

## 快速開始

```bash
# 克隆倉庫
git clone https://github.com/Kan090808/Kan090808.github.io.git
cd Kan090808.github.io

# 安裝並運行本地伺服器
npm install -g serve
serve .

# 打開瀏覽器訪問 http://localhost:3000
```

## 如何使用

1. 克隆並本地運行（見上方快速開始）
2. 使用 Google 帳戶登入
3. 授予權限：
   - Google 身份驗證（Firebase）
   - Google Drive 訪問（用於存儲加密筆記）
4. 設置加密密碼
5. 創建加密筆記（最多 5000 字符）
6. 筆記自動加密後保存到你的 Google Drive
7. 隨時查看和管理你的加密筆記
8. 你的數據始終在**你的 Google Drive** 中——永遠不會存儲在任何中央伺服器

## 架構

- **身份驗證**：通過 Firebase 的 Google OAuth
- **存儲**：你的個人 Google Drive（用戶控制）
- **加密**：客戶端 AES-256 加密 + PBKDF2 密鑰推導
- **部署**：本地運行——無需依賴託管伺服器
- **數據流**：瀏覽器 → 加密 → 你的 Google Drive（永遠不會存儲在其他地方）

## 安全功能

- **你的數據、你的 Drive**：所有筆記存儲在你的個人 Google Drive 帳戶
- **客戶端專用**：所有加密/解密完全在你的瀏覽器中進行
- **雙重保護**：AES-256 加密 + Google Drive 安全性
- **密碼保護**：使用個人密碼訪問筆記
- **不存儲密碼**：用戶密碼從不存儲——只在內存中保留
- **密碼重新輸入**：每次刷新頁面後必須輸入密碼
- **PBKDF2 密鑰推導**：增強密碼安全性，抵抗暴力破解攻擊
- **唯一 IV**：每次加密使用隨機 IV，相同筆記會有不同輸出

## 加密過程

1. **基於密碼的密鑰推導**：你的密碼通過 PBKDF2 轉換為強加密密鑰，使暴力破解攻擊指數級困難。
2. **初始化向量 (IV) 生成**：每次筆記加密都會生成隨機 IV，確保相同筆記產生不同加密輸出。
3. **AES-256 加密**：筆記內容使用 AES-256 加密，使用你推導的密鑰和生成的 IV。
4. **上傳到 Drive**：加密數據上傳到你的 Google Drive（不上傳到任何中央伺服器）。
5. **按需解密**：查看筆記時，解密在客戶端使用你的密碼進行。

## 限制

- 最多 5000 字符的筆記
- 需要 Google 帳戶
- 如果忘記密碼無法恢復（設計上的安全特性）
- 沒有正確密碼無法解密筆記
- 需要網絡連接以與 Google Drive 同步
- 需要瀏覽器啟用 JavaScript
- Google Drive 有存儲限制（取決於帳戶）

## 使用的技術

- **Google OAuth**：安全的用戶身份驗證
- **Google Drive API**：將加密筆記存儲在你的個人 Drive
- **Firebase Auth**：輕量級身份驗證服務
- **CryptoJS**：AES-256 加密和 PBKDF2 密鑰推導
- **HTML5 和 CSS3**：響應式用戶界面
- **原生 JavaScript**：客戶端邏輯，無外部依賴

## 本地開發設置

### 前置需求
- Git
- Node.js 和 npm
- 一個帶有 OAuth 憑證的 Google Cloud 項目

### 第 1 步：克隆倉庫
```bash
git clone https://github.com/Kan090808/Kan090808.github.io.git
cd Kan090808.github.io
```

### 第 2 步：創建 Google Cloud 項目

1. 轉到 [Google Cloud Console](https://console.cloud.google.com)
2. 創建新項目
3. 啟用 API：
   - Google Drive API
   - Identity and Access Management API
4. 創建 OAuth 2.0 憑證：
   - 應用類型：Web 應用程式
   - 授權重定向 URI：
     - `http://localhost:3000`
     - `http://localhost:3000/callback`
5. 複製 Client ID 和 Client Secret

### 第 3 步：創建 Firebase 項目（僅用於身份驗證）

1. 轉到 [Firebase Console](https://console.firebase.google.com)
2. 創建新項目
3. 啟用 Google 身份驗證
4. 複製你的 Firebase 配置

### 第 4 步：配置本地環境

在根目錄創建 `local-config.js` 文件：

```javascript
function getFirebaseConfig() {
    return {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
}

function getGoogleOAuthConfig() {
    return {
        clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
        scopes: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.appdata'
        ]
    };
}
```

### 第 5 步：安裝和運行

```bash
# 全局安裝 serve
npm install -g serve

# 啟動開發伺服器
serve .

# 打開瀏覽器
# http://localhost:3000
```

### 第 6 步：加載 Google Drive API

應用程序會在需要時自動加載 Google Drive API。首次登錄時會提示你授予 Google Drive 訪問權限。

## 文件結構

```
/
├── index.html              # 主應用（HTML、CSS、JS 合併）
├── style.css              # 應用程式樣式
├── config.js              # 生產環境 Firebase 配置（空的，使用環境變量）
├── local-config.js        # 本地開發配置（git 忽略）
├── README.md              # 此文件
├── CLAUDE.md              # 開發者文檔
├── .gitignore             # Git 忽略規則
└── .github/workflows/
    └── static.yml         # GitHub Pages 部署（已存檔）
```

## 工作原理：數據流

```
┌─────────────────────────────────────────────────────────┐
│                    你的計算機                            │
├─────────────────────────────────────────────────────────┤
│  瀏覽器                                                   │
│  ├─ index.html（加載所有代碼）                           │
│  ├─ 加密/解密（CryptoJS）                                │
│  └─ 用戶密碼（僅在內存中保留）                           │
└──────────┬─────────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌──────────────────┐
│Firebase │  │  你的 Google      │
│  Auth   │  │     Drive        │
└─────────┘  │  （僅加密筆記）  │
             └──────────────────┘
```

## 隱私和安全保證

✅ **你的密碼保留在設備上** - 永遠不會發送到伺服器
✅ **你的筆記已加密** - 只能用你的密碼解密
✅ **你的數據在你的 Drive** - 你控制數據，不是我們
✅ **沒有後端伺服器** - 沒有中央數據收集點
✅ **開源** - 你可以自己審計代碼
✅ **沒有廣告或追蹤** - 純粹的筆記工具

## 限制

- 最多 5000 字符的筆記
- 需要 Google 帳戶
- 如果忘記密碼無法恢復（安全設計）
- 沒有正確密碼無法解密筆記
- 需要網絡連接以與 Google Drive 同步
- 需要瀏覽器啟用 JavaScript
- Google Drive 有存儲限制（取決於帳戶）