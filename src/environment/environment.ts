// Environment Configuration loaded from .env file via @ngx-env/builder
// All variables are prefixed with NG_APP_ and loaded at build time
// @see https://github.com/chihab/ngx-env

// Firebase Configuration
export const firebaseConfig = {
	apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
	authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
};

// Environment configuration
export const environment = {
	production: import.meta.env.NG_APP_PRODUCTION === "true",
};
