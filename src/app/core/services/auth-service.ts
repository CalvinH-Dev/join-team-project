import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable } from "rxjs";
import { take, tap, map } from "rxjs/operators";

import {
	Auth,
	user,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	updateProfile,
	signInAnonymously,
} from "@angular/fire/auth";

import { ToastService } from "@shared/services/toast.service";
import { AppUser } from "@core/interfaces/user";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	// --- DEPENDENCIES ---
	private firebaseAuth = inject(Auth);
	private router = inject(Router);
	private toastService = inject(ToastService);

	readonly firebaseUser$ = user(this.firebaseAuth);
	currentUser = signal<AppUser | null>(null);

	private _isLoggedInSignal = signal(false);

	readonly isLoggedIn$: Observable<boolean> = this.firebaseUser$.pipe(map((user) => !!user));

	constructor() {
		this.firebaseUser$.subscribe((firebaseUser) => {
			if (firebaseUser) {
				const appUser: AppUser = {
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: firebaseUser.displayName,
					isGuest: firebaseUser.isAnonymous,
				};
				this.currentUser.set(appUser);
				this._isLoggedInSignal.set(true);
			} else {
				this.currentUser.set(null);
				this._isLoggedInSignal.set(false);
			}
		});
	}

	// --- PUBLIC API FOR AUTH STATUS ---

	/**
	 * Gibt ein Observable zurück, das den aktuellen Anmeldestatus in Echtzeit liefert.
	 * Wird typischerweise von asynchrone Pipes in Templates verwendet.
	 * @returns Observable<boolean> - true, wenn der Benutzer eingeloggt ist, sonst false.
	 */
	isLoggedIn(): Observable<boolean> {
		return this.isLoggedIn$;
	}

	/**
	 * Gibt den aktuellen Anmeldestatus einmalig zurück und schließt das Observable sofort.
	 * DIESE Methode ist für Route Guards optimiert.
	 * @returns Observable<boolean> - true, wenn der Benutzer eingeloggt ist, sonst false.
	 */
	isLoggedInOnce(): Observable<boolean> {
		return this.isLoggedIn$.pipe(take(1));
	}

	// --- CORE METHODS ---

	signUp(email: string, password: string, displayName: string): Observable<void> {
		const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(
			(userCredential) => {
				if (userCredential.user && displayName) {
					return updateProfile(userCredential.user, { displayName: displayName });
				}
				return Promise.resolve();
			},
		);

		return from(promise).pipe(
			tap(() => {
				this.toastService.showSuccess("Registrierung erfolgreich", "Willkommen an Bord!");
				this.router.navigate(["/main"]);
			}),
			map(() => undefined as void),
		);
	}

	signIn(email: string, password: string): Observable<void> {
		const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);

		return from(promise).pipe(
			tap(() => {
				this.toastService.showSuccess("Anmeldung erfolgreich", "Sie sind jetzt eingeloggt.");
				this.router.navigate(["/main"]);
			}),
			map(() => undefined as void),
		);
	}

	signInAsGuest(): Observable<void> {
		const promise = signInAnonymously(this.firebaseAuth);

		return from(promise).pipe(
			tap(() => {
				this.toastService.showInfo("Gast-Login", "Sie sind jetzt als Gast angemeldet.");
				this.router.navigate(["/main"]);
			}),
			map(() => undefined as void),
		);
	}

	signOut(): Observable<void> {
		const promise = signOut(this.firebaseAuth);

		return from(promise).pipe(
			tap(() => {
				this.toastService.showInfo("Abmeldung", "Sie wurden erfolgreich abgemeldet.");
				this.router.navigate(["/login"]);
			}),
		);
	}
}
