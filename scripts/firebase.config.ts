import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Firebase Configuration Interface
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Get Firebase configuration from environment variables
 * Reads from .env file in project root
 *
 * @returns FirebaseConfig object with all required Firebase settings
 * @throws Error if required environment variables are missing
 */
export function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.NG_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NG_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NG_APP_FIREBASE_APP_ID || '',
  };

  // Validate that all required fields are present
  const missingFields = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missingFields.join(', ')}\n` +
      'Please check your .env file and ensure all NG_APP_FIREBASE_* variables are set.'
    );
  }

  return config;
}
