# Encrypted Note App

A secure, client-side encrypted note-taking application built with Firebase and CryptoJS. Users can create, view, and manage encrypted notes that can only be accessed with their personal password.

## How to Use

1. Login with your Google account
2. Set up an encryption password
3. Create notes (up to 500 words each)
4. View and manage your encrypted notes
5. Notes are encrypted before storage

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

- Maximum 10 notes per user
- 500-word limit per note
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

# 加密笔记

一个使用 Firebase 和 CryptoJS 构建的安全客户端加密笔记应用程序。用户可以创建、查看和管理只能通过个人密码访问的加密笔记。

## 如何使用

1. 使用您的 Google 帐户登录
2. 设置加密密码
3. 创建笔记（每篇最多 500 字）
4. 查看和管理您的加密笔记
5. 笔记在存储前会被加密

## 安全功能

- **Firebase 身份验证**：仅限授权访问。
- **密码保护**：使用个人密码访问笔记。
- **不存储密码**：用户密码从不存储。
- **重新输入密码**：每次刷新页面后必须输入密码。
- **客户端 AES 加密**：笔记在存储前使用安全的 AES 算法加密。
- **PBKDF2 密钥派生**：增强密码安全性。
- **唯一 IV**：相同笔记产生不同输出。

## 加密过程

1. **基于密码的密钥派生**：您的密码通过 PBKDF2 转换为强加密密钥，从而增加安全性，使暴力破解攻击更加困难。
2. **初始化向量 (IV) 生成**：每次加密会话生成一个随机 IV，确保即使是相同的数据也会有不同的加密输出。
3. **AES 加密**：笔记内容使用 AES 和派生密钥及生成的 IV 加密，确保只有拥有正确密码的人才能解密。
4. **数据存储**：加密数据及 IV 被安全存储，确保即使被拦截，没有正确密码也无法读取。

## 限制

- 每个用户最多 10 条笔记
- 每条笔记 500 字限制
- 如果忘记密码无法恢复
- 没有正确密码无法解密笔记

## 使用的技术

- Firebase：用于身份验证和实时数据库功能。
- CryptoJS：用于 AES 加密、PBKDF2 密钥派生和 IV 管理。
- HTML5 和 CSS3：用于应用程序的结构和样式。
- 原生 JavaScript：用于客户端逻辑和交互。

## 本地开发

在本地运行应用程序时：

1. 在 GitHub Pages 上托管时，确保您的 GitHub 密钥已设置好以进行部署。
2. 在 localhost 上运行应用程序时，确保 `index.html` 中包含 `local-config.js` 文件。
3. 使用 `serve` 命令启动开发服务器（通过 `npm install -g serve` 安装并使用 `serve .` 运行）。

## 设置

1. 克隆仓库：
```bash
git clone <your-repository-url>
```

2. 在根目录创建一个 `local-config.js` 文件，包含您的 Firebase 配置：
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

3. 设置 Firebase：
   - 创建一个新的 Firebase 项目
   - 启用 Google 身份验证
   - 设置实时数据库
   - 将您的域名添加到授权域名

4. 使用本地服务器提供应用程序或部署到您的托管服务。