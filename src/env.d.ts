// Type definitions for @ngx-env/builder environment variables
// This provides TypeScript auto-complete and type checking for import.meta.env

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
	// Environment Mode
	readonly NG_APP_PRODUCTION: string;

	// Firebase Configuration
	readonly NG_APP_FIREBASE_API_KEY: string;
	readonly NG_APP_FIREBASE_AUTH_DOMAIN: string;
	readonly NG_APP_FIREBASE_PROJECT_ID: string;
	readonly NG_APP_FIREBASE_STORAGE_BUCKET: string;
	readonly NG_APP_FIREBASE_MESSAGING_SENDER_ID: string;
	readonly NG_APP_FIREBASE_APP_ID: string;
}
