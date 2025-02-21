const getFirebaseConfig = () => {
    return {
        apiKey: window.FIREBASE_API_KEY,
        authDomain: window.FIREBASE_AUTH_DOMAIN,
        databaseURL: window.FIREBASE_DATABASE_URL,
        projectId: window.FIREBASE_PROJECT_ID,
        storageBucket: window.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
        appId: window.FIREBASE_APP_ID,
        clientId: window.FIREBASE_AUTH_CLIENT_ID
    };
};