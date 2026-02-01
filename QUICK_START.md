# 🚀 快速参考指南 - Google Drive 集成版本

## 📌 核心变更

| 项目 | 旧版 | 新版 |
|------|------|------|
| **数据存储** | Firebase Database | 用户的 Google Drive |
| **部署方式** | GitHub Pages（中央服务器） | 本地运行 |
| **白名单** | 需要申请 | 无需（所有人可用） |
| **隐私等级** | 中等 | 最高 🔐 |
| **用户控制** | 有限 | 完全 100% |

---

## 🔧 用户需要做什么

### 第一次设置（5 分钟）

```bash
# 1️⃣ 克隆项目
git clone https://github.com/Kan090808/Kan090808.github.io.git
cd Kan090808.github.io

# 2️⃣ 复制配置文件
cp local-config.example.js local-config.js

# 3️⃣ 编辑 local-config.js（填入你的凭证）
# 需要：Google OAuth Client ID + Firebase 配置

# 4️⃣ 安装并运行
npm install -g serve
serve .

# 5️⃣ 打开浏览器
# http://localhost:3000
```

### 获取凭证（15 分钟）

#### Google OAuth Client ID
1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 **Google Drive API**
4. 创建 **OAuth 2.0 Client ID**（Web 应用）
5. 添加授权重定向 URI：
   - `http://localhost:3000`
   - `http://localhost:3000/callback`
6. 复制 Client ID

#### Firebase 配置
1. 前往 [Firebase Console](https://console.firebase.google.com)
2. 创建新项目
3. 启用 **Google 认证**
4. 复制 Web 应用配置（API Key, Auth Domain 等）

---

## 📂 关键文件说明

```
根目录/
├── 📄 index.html
│   └─ 主应用程序（包含所有 JS）
│   └─ ✨ 新增：initGoogleApi() 等 Drive 函数
│
├── 📄 README.md
│   └─ 用户指南和部署说明
│   └─ ✨ 完全重写：包含 Google Drive 教程
│
├── 📄 CLAUDE.md
│   └─ 开发者文档
│   └─ ✨ 更新：Google Drive 架构文档
│
├── 📄 local-config.example.js
│   └─ ✨ 新建：配置示例文件
│   └─ 包含详细说明和步骤
│
└── 📄 local-config.js
    └─ 你的本地凭证（gitignored）
    └─ 不要提交到 git！
```

---

## 🔐 安全特性

✅ **加密在浏览器中完成** - 密钥从不上传到服务器  
✅ **密码不存储** - 仅在内存中保留  
✅ **数据在 Drive** - 用户完全控制  
✅ **开源代码** - 你可以审计  
✅ **无追踪** - 无广告、无分析  

---

## ⚙️ 技术栈

```
Frontend:
  ├─ HTML5 / CSS3
  ├─ Vanilla JavaScript (ES6+)
  ├─ Bootstrap 5
  └─ Font Awesome 6

Libraries:
  ├─ Firebase Auth
  ├─ Google Drive API
  ├─ CryptoJS (AES-256, PBKDF2)

Storage:
  └─ Google Drive (encrypted-notes.json)
```

---

## 📊 笔记限制

- **最大笔记数**：50 条
- **每条最大长度**：5000 字符
- **存储**：由 Google Drive 空间决定

---

## 💬 功能列表

- ✅ 创建/编辑/删除笔记
- ✅ 客户端加密
- ✅ Google Drive 自动同步
- ✅ 英文/中文双语
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 预览模式（可点击链接）
- ✅ 批量复制笔记

---

## 🐛 常见问题

### Q: 为什么需要自己的 Google Cloud 项目？
**A**: 为了让应用访问你的 Google Drive，需要 OAuth 凭证。这确保只有你的应用可以访问你的数据。

### Q: 笔记存储在哪里？
**A**: 你的 Google Drive 账户中，名称为 `encrypted-notes.json`。内容已加密。

### Q: 如果我忘记密码怎么办？
**A**: **无法恢复**。这是设计特性 - 为了安全，密码从不存储。

### Q: 可以在多台设备上使用吗？
**A**: 可以。每台设备需要配置 `local-config.js`，笔记通过 Drive 自动同步。

### Q: 应用可以访问我的所有 Drive 文件吗？
**A**: 不可以。权限限制为仅访问该应用创建的文件。

---

## 📚 更多信息

- **完整指南**：见 [README.md](README.md)
- **开发文档**：见 [CLAUDE.md](CLAUDE.md)
- **实现细节**：见 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **配置示例**：见 [local-config.example.js](local-config.example.js)

---

## 🎯 下一步

1. 获取 Google Cloud 凭证 ← **现在做这个**
2. 复制并配置 `local-config.js`
3. 运行 `npm install -g serve && serve .`
4. 打开 http://localhost:3000
5. 登录并开始使用！

---

**需要帮助？** 查看完整的 README.md 或检查浏览器控制台（F12）的错误信息。
