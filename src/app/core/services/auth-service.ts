import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
  signInAnonymously
} from '@angular/fire/auth';

import { ToastService } from '@shared/services/toast.service';
// ---------------------------

// Angenommener Import für das Benutzer-Interface
import { AppUser } from '@core/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // --- DEPENDENCIES ---
  private firebaseAuth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // --- AUTH STATE (Signals & Observables) ---
  readonly firebaseUser$ = user(this.firebaseAuth);
  currentUser = signal<AppUser | null>(null);
  isLoggedIn = signal(false);

  constructor() {
    this.firebaseUser$.subscribe(firebaseUser => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isGuest: firebaseUser.isAnonymous,
        };
        this.currentUser.set(appUser);
        this.isLoggedIn.set(true);
      } else {
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
      }
    });
  }

  // --- CORE METHODS ---

  signUp(email: string, password: string, displayName: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(userCredential => {
        if (userCredential.user && displayName) {
          return updateProfile(userCredential.user, { displayName: displayName });
        }
      });

    return from(promise).pipe(
      tap(() => {
        this.toastService.showSuccess('Registrierung erfolgreich', 'Willkommen an Bord!');
        this.router.navigate(['/main']);
      }),
      switchMap(() => new Observable<void>(observer => observer.complete()))
    );
  }

  signIn(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);

    return from(promise).pipe(
      tap(() => {
        this.toastService.showSuccess('Anmeldung erfolgreich', 'Sie sind jetzt eingeloggt.');
        this.router.navigate(['/main']);
      }),
      switchMap(() => new Observable<void>(observer => observer.complete()))
    );
  }

  signInAsGuest(): Observable<void> {
    const promise = signInAnonymously(this.firebaseAuth);

    return from(promise).pipe(
      tap(() => {
        this.toastService.showInfo('Gast-Login', 'Sie sind jetzt als Gast angemeldet.');
        this.router.navigate(['/main']);
      }),
      switchMap(() => new Observable<void>(observer => observer.complete()))
    );
  }

  signOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);

    return from(promise).pipe(
      tap(() => {
        this.toastService.showInfo('Abmeldung', 'Sie wurden erfolgreich abgemeldet.');
        this.router.navigate(['/auth/login']);
      }),
      switchMap(() => new Observable<void>(observer => observer.complete()))
    );
  }
}
