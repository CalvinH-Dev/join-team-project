/**
 * Firebase Configuration
 *
 * Centralized Firebase configuration loaded from environment variables.
 * Values are read from .env file via @ngx-env/builder at build time.
 *
 * @see .env.example for required environment variables
 */

export const firebaseConfig = {
	apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
	authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
};
