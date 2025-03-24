# Encrypted Note App

A secure, client-side encrypted note-taking application built with Firebase and CryptoJS. Users can create, view, and manage encrypted notes that can only be accessed with their personal password.

## Features

- 🔐 Google Authentication
- 🔑 Client-side encryption using AES
- 📝 Create and manage up to 10 notes
- 💾 Automatic password persistence
- 🎨 Modern, responsive UI
- 🚫 Word limit protection (500 words per note)

## Technologies Used

- Firebase (Authentication & Realtime Database)
- CryptoJS (AES encryption)
- HTML5/CSS3
- Vanilla JavaScript

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

## Local Development

When running the application locally:

1. Comment out the production config files (`config.js` and `env-config.js`) in `index.html`
2. Uncomment the local configuration file (`local-config.js`) in `index.html`
3. Start the development server using `serve` command (install with `npm install -g serve` and run with `serve .`)

## Usage

1. Login with your Google account
2. Set up an encryption password
3. Create notes (up to 500 words each)
4. View and manage your encrypted notes
5. All notes are automatically encrypted before storage

## Security Features

- Client-side AES encryption
- Encrypted password storage in localStorage
- User-specific encryption keys
- No plaintext data stored in the database

## Limitations

- Maximum 10 notes per user
- 500-word limit per note
- Password cannot be recovered if forgotten
- Notes cannot be decrypted without the correct password

## Development

The project structure is simple: