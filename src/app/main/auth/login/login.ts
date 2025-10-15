import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@core/services/auth-service";
import { ToastService } from "@shared/services/toast.service";

@Component({
	selector: "app-login",
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: "./login.html",
	styleUrls: ["./login.scss"],
})
export class Login {
	private authService = inject(AuthService);
	private router = inject(Router);
	private toastService = inject(ToastService);

	errorMessage: string | null = null;
	isLoading: boolean = false;

  // 1. Formulargruppe definieren
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    acceptedPolicy: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator }); // 2. Custom Validator hinzufügen

  // 3. Custom Validator für Passwortgleichheit
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    // Setzt den Fehler 'passwordMismatch' auf 'confirmPassword'-Feld, wenn sie nicht übereinstimmen
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Registriert den Benutzer mithilfe des AuthService.
   */
  onSignUp(): void {
    this.errorMessage = null;

    if (this.signupForm.invalid) {
      this.toastService.showError('Validierungsfehler', 'Bitte überprüfen Sie alle Eingabefelder und akzeptieren Sie die Datenschutzrichtlinie.');
      return;
    }

    const { email, password, name } = this.signupForm.value;

    if (email && password && name) {
      this.isLoading = true;

      this.authService.signUp(email, password, name).subscribe({
        error: (error) => {
          this.isLoading = false;
          // Fehlerbehandlung
          this.errorMessage = 'Registrierung fehlgeschlagen.';
          this.toastService.showError('Registrierungsfehler', this.errorMessage);
        },
        complete: () => {
          this.isLoading = false;
          // Bei Erfolg navigiert der AuthService zu '/main'
        }
      });
    }
  }

}
