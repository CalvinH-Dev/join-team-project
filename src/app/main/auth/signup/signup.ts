import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
	FormControl,
	FormGroup,
	Validators,
	ReactiveFormsModule,
	ValidatorFn,
	AbstractControl,
} from "@angular/forms";
import { AuthService } from "@core/services/auth-service";
import { ToastService } from "@shared/services/toast.service";

@Component({
	selector: "app-signup",
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: "./signup.html",
	styleUrl: "./signup.scss",
})

export class Signup {
	private authService = inject(AuthService);
	private router = inject(Router);
	private toastService = inject(ToastService);

	errorMessage: string | null = null;
	isLoading: boolean = false;

	passwordMatchValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
		const password = group.get("password")?.value;
		const confirmPassword = group.get("confirmPassword")?.value;

		// Optional: Füge eine Null-Prüfung hinzu
		if (!password || !confirmPassword) {
			return null;
		}

		// Gibt null zurück, wenn valid (Passwörter stimmen überein), sonst das Fehlerobjekt.
		return password === confirmPassword ? null : { passwordMismatch: true };
	};

	/**
	 * 2. Formulargruppe definieren mit allen Feldern
	 */
	signupForm = new FormGroup(
		{
			name: new FormControl("", [Validators.required, Validators.minLength(3)]),
			email: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [Validators.required, Validators.minLength(8)]),
			confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
			acceptedPolicy: new FormControl(false, [Validators.requiredTrue]),
		},
		{ validators: this.passwordMatchValidator }, 
	);

	/**
	 * Registriert den Benutzer mithilfe des AuthService.
	 */
	onSignUp(): void {
		this.errorMessage = null;

		if (this.signupForm.invalid) {
			this.toastService.showError(
				"Validierungsfehler",
				"Bitte überprüfen Sie alle Eingabefelder und akzeptieren Sie die Datenschutzrichtlinie.",
			);
			return;
		}

		const email = this.signupForm.value.email as string;
		const password = this.signupForm.value.password as string;
		const name = this.signupForm.value.name as string;

		if (email && password && name) {
			this.isLoading = true;

			this.authService.signUp(email, password, name).subscribe({
				error: (error) => {
					this.isLoading = false;
					this.errorMessage = "Registrierung fehlgeschlagen.";
					// Generische Fehlermeldung anzeigen
					this.toastService.showError("Registrierungsfehler", this.errorMessage);
				},
				complete: () => {
					this.isLoading = false;
					// Die Navigation findet bereits im AuthService statt
				},
			});
		}
	}
}
