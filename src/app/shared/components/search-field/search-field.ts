import { Component, input, output, signal } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";

/**
 * Interface zur Verwaltung des Fehler-Anzeigezustands.
 */
interface ErrorCheck {
	required: boolean;
	minLength: boolean;
	timeout: null | number;
}

@Component({
	selector: "app-search-field",
	standalone: true, // Annahme: Nutzung als Standalone Component für einfache Imports
	imports: [FormsModule],
	templateUrl: "./search-field.html",
	styleUrl: "./search-field.scss",
})
export class SearchField {
	// Input für die minimale Länge des Suchbegriffs
	minlength = input<number>(3); // Signal für den Wert des Input-Feldes (wird über ngModel gebunden)
	textValue = signal(""); // Output, um den validierten Suchbegriff an die Parent-Komponente (BoardView) zu senden
	searchText = output<string>();
	showError: ErrorCheck = {
		required: false,
		minLength: false,
		timeout: null,
	};

	/**
	 * Wird aufgerufen, wenn die Suche ausgelöst wird (z.B. durch Klick auf das Such-Icon oder Submit).
	 * @param input Das NgModel-Objekt des Input-Feldes.
	 */
	onSearch(input: NgModel) {
		if (this.showError.timeout) {
			clearTimeout(this.showError.timeout);
		}

		if (input.valid) {
			this.emitText(input);
		} else {
			this.showErrors(input);
		}
	}

	/**
	 * Emittiert den Suchbegriff und setzt das Input-Feld zurück.
	 * @param input Das NgModel-Objekt.
	 */
	private emitText(input: NgModel) {
		// Hier wird der String emittiert
		this.searchText.emit(this.textValue());
		input.reset("");
	}

	/**
	 * Zeigt Fehler basierend auf der NgModel-Validierung an.
	 * @param input Das NgModel-Objekt.
	 */
	private showErrors(input: NgModel) {
		if (input.errors?.["required"]) {
			this.showError.required = true;
		} else if (input.errors?.["minlength"]) {
			this.showError.minLength = true;
		}

		this.showError.timeout = setTimeout(() => {
			this.showError.minLength = false;
			this.showError.required = false;
		}, 3000);
	}
}
