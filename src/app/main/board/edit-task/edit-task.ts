import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-edit-task",
	imports: [CommonModule, FormsModule],
	templateUrl: "./edit-task.html",
	styleUrl: "./edit-task.scss",
})
export class EditTask {
	@Output() closed = new EventEmitter<void>();

	closeEditOverlay() {
		this.closed.emit();
	}

	title = "";
	description = "";
	dueDate = "";
	category = "";
	subtask = "";
	assignedTo = "";

	titleFocus = false;
	dueDateFocus = false;
	categoryFocus = false;
	descriptionFocus = false;
	assignedFocus = false;
	subtaskFocus = false;
	categoryTouched = false;

	selectedPriority = "";
	setPriority(priority: string) {
		this.selectedPriority = priority;
	}

	assignedDropdownOpen = false;
	activeItem: string | null = null;

	onInputClick() {
		this.assignedDropdownOpen = !this.assignedDropdownOpen;
	}

	selectAssigned(name: string) {
		this.activeItem = name;
		this.assignedTo = name;

		setTimeout(() => {
			this.assignedDropdownOpen = false;
			this.activeItem = null;
		}, 120);
	}

	categoryDropdownOpen = false;
	activeCategory: string | null = null;

	onCategoryClick() {
		this.categoryDropdownOpen = !this.categoryDropdownOpen;
	}

	selectCategory(cat: string) {
		this.activeCategory = cat;
		this.category = cat;

		setTimeout(() => {
			this.categoryDropdownOpen = false;
			this.activeCategory = null;
		}, 120);
	}
}
