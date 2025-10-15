import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth-service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // Services injizieren
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  errorMessage: string | null = null;
  isLoading: boolean = false;

  // Formulargruppe für E-Mail und Passwort
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor() {
    // Optional: Wenn der Benutzer bereits eingeloggt ist, direkt weiterleiten
    if (this.authService.isLoggedIn()) {
       this.router.navigate(['/main']);
    }
  }

  /**
   * Meldet den Benutzer mit E-Mail und Passwort an.
   */
  onLogin(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.toastService.showError('Fehler', 'Bitte geben Sie eine gültige E-Mail und ein Passwort (min. 6 Zeichen) ein.');
      return;
    }

    const { email, password } = this.loginForm.value;

    if (email && password) {
      this.isLoading = true;

      this.authService.signIn(email, password).subscribe({
        error: (error) => {
          this.isLoading = false;
          // Firebase-spezifische Fehlerbehandlung
          const code = error.code;
          if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
             this.errorMessage = 'Ungültige Anmeldedaten. Bitte prüfen Sie E-Mail und Passwort.';
          } else {
             this.errorMessage = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
          }
          this.toastService.showError('Login-Fehler', this.errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Meldet den Benutzer anonym als Gast an.
   */
  onGuestLogin(): void {
    this.errorMessage = null;
    this.isLoading = true;

    this.authService.signInAsGuest().subscribe({
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Fehler beim Gast-Login.';
        this.toastService.showError('Gast-Login-Fehler', 'Der anonyme Login ist fehlgeschlagen.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
