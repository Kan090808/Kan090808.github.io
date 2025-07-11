# Encrypted Note App

A secure, client-side encrypted note-taking application built with Firebase and CryptoJS. Users can create, view, and manage encrypted notes that can only be accessed with their personal password.

## How to Use

1. Login with your Google account
2. Set up an encryption password
3. If you are whitelisted, you can create notes (up to 5000 characters each)
4. If you are not whitelisted, you can log in but cannot create notes
5. If you are not whitelisted, you will see a dialog to contact the developer for whitelisting (send your userID via email)
6. You can check your userID after clicking the profile button
7. View and manage your encrypted notes
8. Notes are encrypted before storage

## Security Features

- **Firebase Authentication**: Only authorized access.
- **Password Protection**: Access notes with a personal password.
- **No Password Storage**: User passwords are never stored.
- **Password Re-entry**: Password must be entered after each page refresh.
- **Client-Side AES Encryption**: Notes are encrypted using the secure AES algorithm before storage.
- **PBKDF2 Key Derivation**: Strengthens password security.
- **Unique IVs**: Different outputs for identical notes.

## Encryption Process

1. **Password-Based Key Derivation**: Your password is transformed into a strong encryption key using PBKDF2, which adds security by making brute-force attacks more difficult.
2. **Initialization Vector (IV) Generation**: A random IV is generated for each encryption session, ensuring that even identical data will have different encrypted outputs.
3. **AES Encryption**: The note content is encrypted using AES with the derived key and the generated IV, ensuring that only someone with the correct password can decrypt it.
4. **Data Storage**: The encrypted data, along with the IV, is stored securely, ensuring that even if intercepted, it remains unreadable without the correct password.


## Limitations

- Website is in beta; only whitelisted users can create notes
- Maximum 5000 characters per note
- Non-whitelisted users can log in but cannot create notes
- If you are not whitelisted, you will see a dialog to contact the developer for whitelisting (send your userID via email)
- You can check your userID after clicking the profile button
- You should send your userID to the developer for whitelisting
- Password cannot be recovered if forgotten
- Notes cannot be decrypted without the correct password

## Technologies Used

- Firebase: Utilized for Authentication and Realtime Database functionalities.
- CryptoJS: Employed for AES encryption, PBKDF2 key derivation, and IV management.
- HTML5 and CSS3: Used for structuring and styling the application.
- Vanilla JavaScript: Implemented for client-side logic and interactions.

## Local Development

When running the application locally:

1. When hosting on GitHub Pages, ensure your GitHub keys are set up for deployment.
2. When running the application on localhost, ensure the `local-config.js` file is included in `index.html`.
3. Start the development server using `serve` command (install with `npm install -g serve` and run with `serve .`)

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
```

2. Create a `local-config.js` file in the root directory with your Firebase configuration:
```javascript
function getFirebaseConfig() {
    return {
        apiKey: "your-api-key",
        authDomain: "your-auth-domain",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    };
}
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Google Authentication
   - Set up Realtime Database
   - Add your domain to authorized domains

4. Serve the application using a local server or deploy to your hosting service.

# 加密筆記

一個使用 Firebase 和 CryptoJS 構建的安全客戶端加密筆記應用程式。用戶可以創建、查看和管理只能通過個人密碼訪問的加密筆記。

## 如何使用

1. 使用您的 Google 帳戶登入
2. 設定加密密碼
3. 若您在白名單中，則可創建筆記（每篇最多 5000 字）
4. 若您不在白名單中，仍可登入但無法創建筆記
5. 若您不在白名單中，會看到聯絡開發者以加入白名單的對話框（請通過電子郵件發送您的使用者 ID）
6. 點擊個人資料按鈕後可查看您的使用者 ID
7. 查看和管理您的加密筆記
8. 筆記在儲存前會被加密

## 安全功能

- **Firebase 身份驗證**：僅限授權訪問。
- **密碼保護**：使用個人密碼訪問筆記。
- **不儲存密碼**：用戶密碼從不儲存。
- **重新輸入密碼**：每次刷新頁面後必須輸入密碼。
- **客戶端 AES 加密**：筆記在儲存前使用安全的 AES 演算法加密。
- **PBKDF2 密鑰衍生**：增強密碼安全性。
- **唯一 IV**：相同筆記產生不同輸出。

## 加密過程

1. **基於密碼的密鑰衍生**：您的密碼通過 PBKDF2 轉換為強加密密鑰，從而增加安全性，使暴力破解攻擊更加困難。
2. **初始化向量 (IV) 生成**：每次加密會話生成一個隨機 IV，確保即使是相同的數據也會有不同的加密輸出。
3. **AES 加密**：筆記內容使用 AES 和衍生密鑰及生成的 IV 加密，確保只有擁有正確密碼的人才能解密。
4. **數據儲存**：加密數據及 IV 被安全儲存，確保即使被攔截，沒有正確密碼也無法讀取。

## 限制

- 網站目前為測試階段，僅限白名單用戶可創建筆記
- 每條筆記 5000 字限制
- 不在白名單的用戶可登入但無法創建筆記
- 不在白名單時會看到聯絡開發者的對話框（請通過電子郵件發送您的使用者 ID）
- 點擊個人資料按鈕後可查看您的使用者 ID
- 您應將您的使用者 ID 發送給開發者以加入白名單
- 如果忘記密碼無法恢復
- 沒有正確密碼無法解密筆記

## 使用的技術

- Firebase：用於身份驗證和實時數據庫功能。
- CryptoJS：用於 AES 加密、PBKDF2 密鑰衍生和 IV 管理。
- HTML5 和 CSS3：用於應用程式的結構和樣式。
- 原生 JavaScript：用於客戶端邏輯和互動。

## 本地開發

在本地運行應用程式時：

1. 在 GitHub Pages 上託管時，確保您的 GitHub 密鑰已設置好以進行部署。
2. 在 localhost 上運行應用程式時，確保 `index.html` 中包含 `local-config.js` 文件。
3. 使用 `serve` 命令啟動開發伺服器（通過 `npm install -g serve` 安裝並使用 `serve .` 運行）。

## 設置

1. 克隆倉庫：
```bash
git clone <your-repository-url>
```

2. 在根目錄建立一個 `local-config.js` 檔案，包含您的 Firebase 配置：
```javascript
function getFirebaseConfig() {
    return {
        apiKey: "your-api-key",
        authDomain: "your-auth-domain",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    };
}
```

3. 設定 Firebase：
   - 建立一個新的 Firebase 專案
   - 啟用 Google 身份驗證
   - 設定即時資料庫
   - 將您的網域加入到授權網域

4. 使用本地伺服器提供應用程式或部署到您的託管服務。