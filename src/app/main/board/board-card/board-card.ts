import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";

// Angenommener Import für Task-Datenstruktur
import { Task } from "@app/core/interfaces/task";

@Component({
	selector: "app-board-card",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./board-card.html",
	styleUrl: "./board-card.scss",
})
export class BoardCard {
	cardClicked = output<number>();

	editTask() {
		throw new Error("Method not implemented.");
	}
	// Input, der die gesamte Aufgabe von der board-view erhält
	task = input.required<Task>();

	// Helper-Funktion zur Bestimmung der Kategorie-Farbe basierend auf dem Task-Objekt
	getCategoryColor(): string {

		if (this.task().category === "Technical") {
			return "var(--task-category-color-blue)";
		}
		if (this.task().category === "Sales") {
			return "var(--task-category-color-teal)";
		}
		// Fallback oder weitere Kategorien hier hinzufügen
		return "var(--text-color-black)";
	}

	openDetailView() {
		this.cardClicked.emit(this.task().id!);
	}
}
