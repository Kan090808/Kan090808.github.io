/**
 * LOCAL CONFIGURATION EXAMPLE
 * 
 * Copy this file to `local-config.js` and fill in your credentials.
 * local-config.js is gitignored - never commit real credentials!
 * 
 * You need to set up:
 * 1. Firebase Project (for authentication only)
 * 2. Google Cloud Project (for Google Drive API)
 */

function getFirebaseConfig() {
    return {
        // Get these from Firebase Console > Project Settings
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
}

function getGoogleOAuthConfig() {
    return {
        // Get this from Google Cloud Console > APIs & Services > Credentials
        // Create an "OAuth 2.0 Client ID" for "Web application"
        // Add http://localhost:3000 to authorized redirect URIs
        clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        
        // Optional: API Key for Drive API calls
        // If not provided, will attempt to use OAuth token
        apiKey: "YOUR_GOOGLE_API_KEY",
        
        // These scopes are required for Google Drive access
        scopes: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.appdata'
        ]
    };
}

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. CREATE FIREBASE PROJECT:
 *    - Go to https://console.firebase.google.com
 *    - Create a new project
 *    - Go to Project Settings (gear icon)
 *    - Copy your web app credentials
 * 
 * 2. ENABLE GOOGLE AUTHENTICATION:
 *    - In Firebase Console, go to Authentication
 *    - Click "Get Started"
 *    - Enable "Google" sign-in method
 *    - Add your OAuth credentials (created in step 3)
 * 
 * 3. CREATE GOOGLE CLOUD PROJECT:
 *    - Go to https://console.cloud.google.com
 *    - Create a new project (or use the same as Firebase)
 *    - Enable APIs:
 *      * Google Drive API
 *    - Go to APIs & Services > Credentials
 *    - Create "OAuth 2.0 Client ID"
 *      * Application type: Web application
 *      * Authorized redirect URIs: http://localhost:3000
 *      * Authorized redirect URIs: http://localhost:3000/callback
 *    - Copy the Client ID and paste above
 * 
 * 4. (OPTIONAL) CREATE API KEY:
 *    - In Google Cloud Console > Credentials
 *    - Create an "API Key"
 *    - Restrict it to Google Drive API only
 *    - Paste above (optional, for better quota management)
 * 
 * 5. SAVE THIS FILE:
 *    - Rename this file to `local-config.js`
 *    - Fill in all YOUR_* placeholders
 *    - Keep it local - never commit to git!
 */
