# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side encrypted note-taking application with the following characteristics:
- **Technology Stack**: Vanilla JavaScript (ES6+), HTML5, CSS3, Firebase (Authentication only), Google Drive API, CryptoJS
- **Architecture**: Single-page application with client-side encryption, data stored in user's Google Drive
- **Security**: AES encryption with PBKDF2 key derivation, client-side only password handling
- **Hosting**: Run locally - no central server required. Users can clone and run on their own computers

## Development Commands

### Local Development
```bash
# Install serve globally (if not already installed)
npm install -g serve

# Start local development server
serve .

# Access at http://localhost:3000
```

### Testing and Validation
- **Manual Testing**: Run `serve .` and test at http://localhost:3000
- **Security Testing**: Verify encryption/decryption works correctly
- **Authentication Testing**: Test Google OAuth flow with Drive permissions
- **Responsive Testing**: Check mobile/desktop layouts
- **Drive Integration**: Verify notes are saved to personal Google Drive

### Deployment
- **No server deployment needed**: Users clone locally and run
- **Local-first architecture**: All data stays in user's Google Drive

## Code Architecture

### Core Components

**Configuration Management** (`config.js`, `local-config.js`):
- Dynamic config loading based on hostname (localhost vs production)
- Firebase credentials for authentication only
- Google OAuth client configuration
- Local uses `local-config.js`, provides both configs

**Main Application** (`index.html` lines 1-890):
- Single-file application with embedded JavaScript
- Modular functions for auth, encryption, note management
- Multi-language support (English/Chinese)
- Google Drive API integration

**Authentication Flow**:
- Google OAuth via Firebase Auth
- Extended with Google Drive scopes (drive.file, drive.appdata)
- User state management with `auth.onAuthStateChanged`
- Automatic UI switching between login/main views

**Encryption System**:
- `encryptNote()`: AES encryption with PBKDF2 key derivation
- `decryptNote()`: Corresponding decryption with error handling
- Password never stored, only kept in memory during session

**Google Drive Integration**:
- `initGoogleApi()`: Initialize Google API client
- `initDriveNotes()`: Check/create notes file in Drive
- `loadNotesFromDrive()`: Fetch encrypted notes file
- `saveNotesToDrive()`: Upload updated notes to Drive
- Single JSON file stored in user's Google Drive (encrypted-notes.json)

**Note Management**:
- CRUD operations via Google Drive
- All notes stored in encrypted-notes.json file
- 50 note limit per user, 500 word limit per note
- Each note has unique ID, timestamp, and encrypted content

### Key Functions

**Google Drive Functions**:
- `initGoogleApi()`: Load and initialize Google API client
- `initDriveNotes()`: Find or create notes file in Drive
- `loadNotesFromDrive()`: Read current notes from Drive
- `saveNotesToDrive()`: Update notes file in Drive
- `createDriveNotesFile()`: Create encrypted-notes.json in Drive

**Security Functions**:
- `encryptNote(content)`: AES encryption with random IV and salt
- `decryptNote(encryptedData)`: Decryption with error handling
- `savePassword()`: Sets encryption password in memory only

**UI Management**:
- `toggleLanguage()`: Switch between English/Chinese
- `showToast(message, type)`: User feedback system
- `adjustTextareaHeight()`: Dynamic textarea sizing

**Note Operations**:
- `createNote()`: Encrypt and save new note to Drive
- `loadNotes()`: Fetch and decrypt user notes from Drive
- `saveNoteChanges()`: Update existing note in Drive
- `deleteNote()`: Remove note from Drive

## Firebase Configuration

### Required Environment Variables (Firebase Auth only)
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`

Note: Firebase Database is NO LONGER USED. All data storage is in Google Drive.

### Google OAuth Configuration (Required)
```javascript
function getGoogleOAuthConfig() {
    return {
        clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
        apiKey: "YOUR_GOOGLE_API_KEY", // Optional, for Drive API
        scopes: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.appdata'
        ]
    };
}
```

### Local Development Setup
Create `local-config.js` with both Firebase and Google OAuth credentials

## Security Considerations

- **Client-side only**: All encryption happens in browser
- **No password storage**: Passwords never leave client memory
- **No central server**: Data never stored on backend servers
- **User-controlled storage**: All data in user's personal Google Drive
- **PBKDF2 key derivation**: Strengthens password security
- **Unique IVs**: Each encryption uses random initialization vector
- **Error handling**: Graceful degradation for decryption failures
- **No account required**: Users authenticate with Google, not with app

## Data Flow Architecture

```
Browser (User's Computer)
    ├─ Authentication (Firebase Auth + Google OAuth)
    ├─ Encryption/Decryption (CryptoJS)
    └─ User Password (Memory only)
           ↓
    Google Drive (User's Account)
         └─ encrypted-notes.json (encrypted data only)
```

## File Structure

```
/
├── index.html           # Main application (HTML, CSS, JS)
├── style.css           # Application styles
├── config.js           # Firebase config (empty, uses env vars)
├── local-config.js     # Local development config (gitignored)
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── .github/workflows/
    └── static.yml      # GitHub Pages deployment (archived)
```

## Language Support

- **Default**: English (en)
- **Alternative**: Traditional Chinese (zh)
- **Storage**: Browser localStorage for persistence
- **Toggle**: Language button in top-right corner

## Deployment Workflow

1. **User Setup**: Clone repository locally
   ```bash
   git clone <repo-url>
   cd Kan090808.github.io
   ```

2. **Configure Local Environment**:
   - Create `local-config.js` with Firebase and Google OAuth credentials
   - Firebase: Only used for authentication
   - Google OAuth: Used for Google Drive access

3. **Run Locally**:
   ```bash
   npm install -g serve
   serve .
   ```

4. **First Login**:
   - User authenticates with Google
   - App requests Drive permissions (scopes: drive.file, drive.appdata)
   - App creates encrypted-notes.json in user's Drive (if not exists)
   - User sets encryption password
   - Notes sync automatically to user's Google Drive

## Limitations to Consider

- Maximum 50 notes per user
- 5000 character limit per note
- Password recovery impossible (by design)
- Google Drive dependency (requires internet connection)
- Requires JavaScript enabled
- Requires own Google Cloud project setup for local running