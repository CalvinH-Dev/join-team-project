import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter, withInMemoryScrolling, withViewTransitions } from "@angular/router";

import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { routes } from "@app/app.routes";
import { initializeFirestore } from "@core/initializers/firestore.initializer";
import { FirestoreInitService } from "@core/services/firestore-init.service";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: "enabled",
				anchorScrolling: "enabled",
			}),
			withViewTransitions(),
		),
		// Firebase Setup - einheitliche Konfiguration
		provideFirebaseApp(() =>
			initializeApp({
				apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
				authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
				projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
				storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
				messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
				appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
			}),
		),
		provideFirestore(() => getFirestore()),

		// Firestore Schema Initialization
		{
			provide: APP_INITIALIZER,
			useFactory: initializeFirestore,
			deps: [FirestoreInitService],
			multi: true,
		},
		provideAuth(() => getAuth()),
	],
};
