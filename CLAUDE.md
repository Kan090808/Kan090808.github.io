# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side encrypted note-taking application with the following characteristics:
- **Technology Stack**: Vanilla JavaScript (ES6+), HTML5, CSS3, Firebase (Authentication + Realtime Database), CryptoJS
- **Architecture**: Single-page application with client-side encryption
- **Security**: AES encryption with PBKDF2 key derivation, client-side only password handling
- **Hosting**: GitHub Pages with automated deployment

## Development Commands

### Local Development
```bash
# Install serve globally (if not already installed)
npm install -g serve

# Start local development server
serve .
```

### Testing and Validation
- **Manual Testing**: Run `serve .` and test at http://localhost:3000
- **Security Testing**: Verify encryption/decryption works correctly
- **Authentication Testing**: Test Google OAuth flow
- **Responsive Testing**: Check mobile/desktop layouts

### Deployment
- **Automatic**: Push to `main` branch triggers GitHub Pages deployment via `.github/workflows/static.yml`
- **Manual**: Use GitHub Actions workflow_dispatch trigger

## Code Architecture

### Core Components

**Configuration Management** (`config.js`, `local-config.js`):
- Dynamic config loading based on hostname (localhost vs production)
- Firebase and Google Drive API credentials
- Production uses GitHub Secrets, local uses `local-config.js`

**Main Application** (`index.html` lines 112-545):
- Single-file application with embedded JavaScript
- Modular functions for auth, encryption, note management
- Multi-language support (English/Chinese)

**Authentication Flow**:
- Google OAuth via Firebase Auth
- User state management with `auth.onAuthStateChanged`
- Automatic UI switching between login/main views

**Encryption System**:
- `encryptNote()`: AES encryption with PBKDF2 key derivation
- `decryptNote()`: Corresponding decryption with error handling
- Password never stored, only kept in memory during session

**Note Management**:
- CRUD operations via Firebase Realtime Database
- Path structure: `users/{userId}/notes/{noteId}`
- 50 note limit per user, 500 word limit per note

### Key Functions

**Security Functions**:
- `encryptNote(content)`: AES encryption with random IV and salt
- `decryptNote(encryptedData)`: Decryption with error handling
- `savePassword()`: Sets encryption password in memory only

**UI Management**:
- `toggleLanguage()`: Switch between English/Chinese
- `showToast(message, type)`: User feedback system
- `adjustTextareaHeight()`: Dynamic textarea sizing

**Note Operations**:
- `createNote()`: Encrypt and save new note
- `loadNotes()`: Fetch and decrypt user notes
- `saveNoteChanges()`: Update existing note
- `deleteNote()`: Remove note from database

## Firebase Configuration

### Required Environment Variables (GitHub Secrets)
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_DATABASE_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_AUTH_CLIENT_ID`

### Local Development Setup
Create `local-config.js` with Firebase project credentials (see README.md example)

## Security Considerations

- **Client-side only**: All encryption happens in browser
- **No password storage**: Passwords never leave client memory
- **PBKDF2 key derivation**: Strengthens password security
- **Unique IVs**: Each encryption uses random initialization vector
- **Error handling**: Graceful degradation for decryption failures

## Deployment Workflow

1. **Local Development**: Use `serve .` with `local-config.js`
2. **GitHub Pages**: Automatic deployment on push to `main`
3. **Environment Config**: GitHub Actions creates `env-config.js` from secrets
4. **Static Hosting**: No server-side processing required

## File Structure

```
/
├── index.html           # Main application (HTML, CSS, JS)
├── style.css           # Application styles
├── config.js           # Production Firebase config
├── local-config.js     # Local development config (gitignored)
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── .github/workflows/
    └── static.yml      # GitHub Pages deployment
```

## Language Support

- **Default**: English (en)
- **Alternative**: Traditional Chinese (zh)
- **Storage**: Browser localStorage for persistence
- **Toggle**: Language button in top-right corner

## Limitations to Consider

- Maximum 50 notes per user
- 500 word limit per note
- Password recovery impossible (by design)
- Client-side only (no server-side backup)
- Requires JavaScript enabled
- Firebase dependency for auth/storage