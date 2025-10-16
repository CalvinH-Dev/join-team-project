import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable } from "rxjs";
import { take, tap, map } from "rxjs/operators";

import {
  Auth,
  authState,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
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

  readonly firebaseUser$ = authState(this.firebaseAuth);
  currentUser = signal<AppUser | null>(null);

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
      } else {
        this.currentUser.set(null);
      }
    });
  }

  // --- PUBLIC API FOR AUTH STATUS ---
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  isLoggedInOnce(): Observable<boolean> {
    return this.isLoggedIn$.pipe(take(1));
  }

  // --- CORE METHODS ---

  signUp(email: string, password: string, displayName: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(
      (userCredential: UserCredential) => {
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
      }),
      map(() => {
        this.router.navigate(["/login"]);
        return undefined as void;
      }),
    );
  }
}
