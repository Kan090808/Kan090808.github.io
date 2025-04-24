# Encrypted Note App

A secure, client-side encrypted note-taking application built with Firebase and CryptoJS. Users can create, view, and manage encrypted notes that can only be accessed with their personal password.

## Features

- Google Authentication
- Client-side encryption using AES
- Create and manage notes
- Modern, responsive UI

## Encryption and Security

Our Encrypted Note App uses advanced encryption standards to ensure the security and privacy of your data:

- **AES Encryption**: All notes are encrypted using AES (Advanced Encryption Standard) before being stored in the database. AES is a symmetric encryption algorithm widely recognized for its security and efficiency.
- **Client-side Encryption**: Encryption and decryption occur entirely on the client side. This means that your plaintext data never leaves your device, and only encrypted data is sent to the server.
- **User-specific Encryption Keys**: Each user has a unique encryption key derived from their password. This key is never stored or transmitted, ensuring that only the user can decrypt their notes.
- **Secure Password Storage**: Passwords are hashed and stored securely in localStorage, ensuring that even if localStorage is compromised, the actual password cannot be retrieved.

### Why You Can Trust Our App

1. **No Password Storage**:
   - **Enhanced Security**: By not storing passwords on the server or locally, even if the system is compromised, attackers cannot retrieve user passwords.
   - **User Control**: Requiring password entry upon each page refresh ensures that only the user can decrypt and access their data.

2. **Encrypting Your Data with Your Password**:
   - **Personalized Encryption**: The user's password serves as the encryption key, ensuring that only those with the correct password can decrypt the data.
   - **Enhanced Privacy**: Even if data is intercepted or leaked, it remains unreadable without the correct password.

3. **Incorporating IV (Initialization Vector) and PBKDF2**:
   - **Increased Security with IV**: The IV is a random number used during encryption to ensure that each encryption result is different, even for identical content.
   - **Prevents Pattern Analysis**: Even if an attacker obtains multiple ciphertexts, the use of IV prevents them from deducing the original content by comparing ciphertexts.
   - **Enhanced Key Derivation with PBKDF2**: PBKDF2 (Password-Based Key Derivation Function 2) is used to derive a strong encryption key from the user's password, adding an extra layer of security by making brute-force attacks more difficult.
   - **Adaptive Security**: PBKDF2 allows for the adjustment of iteration counts, which can be increased over time to maintain security as computational power increases.


## Technologies Used

- Firebase (Authentication & Realtime Database)
- CryptoJS (AES encryption, PBKDF2, and IV management)
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

1. When hosting on GitHub Pages, ensure your GitHub keys are set up for deployment.
2. When running the application on localhost, ensure the `local-config.js` file is included in `index.html`.
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