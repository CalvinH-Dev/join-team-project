import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Contact } from "@core/interfaces/contact";
import { ContactService } from "@core/services/contact-service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { TaskService } from "@core/services/task-service";
import { Task } from "@core/interfaces/task";

@Component({
	selector: "app-add-task-form",
	imports: [
		FormsModule,
		CommonModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
	],
	templateUrl: "./add-task-form.html",
	styleUrl: "./add-task-form.scss",
})
export class AddTaskForm {
	title = "";
	description = "";
	dueDate = "";
	category = "";
	subtask = "";

	contacts: Contact[] = [];
	assignedTo: Contact[] = [];

	contactService = inject(ContactService);
	taskService = inject(TaskService);

	titleFocus = false;
	dueDateFocus = false;
	categoryFocus = false;
	descriptionFocus = false;
	assignedFocus = false;
	subtaskFocus = false;

	titleTouched = false;
	dueDateTouched = false;
	categoryTouched = false;

	assignedDropdownOpen = false;
	categoryDropdownOpen = false;

	activeItem: string | null = null;
	activeCategory: string | null = null;

	selectedPriority: "medium" | "low" | "urgent" = "medium";
	setPriority(priority: "medium" | "low" | "urgent") {
		this.selectedPriority = priority;
	}

	onInputClick() {
		this.assignedDropdownOpen = !this.assignedDropdownOpen;
	}

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

	getContactByName(name: string) {
		return (
			this.contacts.find((contact) => contact.name === name) || { initials: "?", color: "default" }
		);
	}

	isAssigned(contact: Contact) {
		return this.assignedTo.some((c) => c.id === contact.id);
	}

	toggleAssigned(contact: Contact) {
		if (this.isAssigned(contact)) {
			this.assignedTo = this.assignedTo.filter((c) => c.id !== contact.id);
		} else {
			this.assignedTo.push(contact);
		}
	}

	get showActionError(): boolean {
		return (
			(this.titleTouched && !this.title) ||
			(this.dueDateTouched && !this.dueDate) ||
			(this.categoryTouched && !this.category)
		);
	}

	onBlur(field: string) {
		if (field === "title") this.titleTouched = true;
		if (field === "dueDate") this.dueDateTouched = true;
		if (field === "category") this.categoryTouched = true;
	}

	// get live contacts from Firestore
	ngOnInit() {
		this.loadContacts();
	}

	loadContacts() {
		const checkInterval = setInterval(() => {
			if (Object.keys(this.contactService.contactsObject).length > 0) {
				this.contacts = Object.values(this.contactService.contactsObject).flat();
				clearInterval(checkInterval);
			}
		}, 200);
	}

	clearForm() {
		this.title = "";
		this.description = "";
		this.dueDate = "";
		this.category = "";
		this.subtask = "";
		this.assignedTo = [];

		this.titleFocus = false;
		this.dueDateFocus = false;
		this.categoryFocus = false;
		this.descriptionFocus = false;
		this.assignedFocus = false;
		this.subtaskFocus = false;
		this.categoryTouched = false;
		this.assignedDropdownOpen = false;
		this.categoryDropdownOpen = false;
		this.activeItem = null;
		this.activeCategory = null;
	}

	formSubmitAttempted = false;

	async createTask() {
		console.log("CreateTask() called");

		if (!this.title || !this.category || !this.dueDate) {
			console.warn("Please fill all required fields");
			return;
		}

		console.log("Validation passed, preparing task...");

		const newTask: Task = {
			title: this.title,
			description: this.description,
			category: this.category as "User Story" | "Technical Task",
			priority: this.selectedPriority as "low" | "medium" | "urgent",
			status: "todo",
			assignedContacts: this.assignedTo.map((c) => c.id ?? "").filter(Boolean),
			subtasks: this.subtask
				? [
						{
							id: Date.now().toString(),
							title: this.subtask,
							completed: false,
							createdAt: new Date(),
						},
					]
				: [],
			dueDate: new Date(this.dueDate),
			color: Math.floor(Math.random() * 10) + 1,
		};

		console.log("New task prepared:", newTask);

		try {
			const taskId = await this.taskService.addTask(newTask);
			console.log("Task successfully added with ID:", taskId);
			this.clearForm();
		} catch (error) {
			console.error("Failed to add task:", error);
		}
	}

	get allRequiredFieldsFilled(): boolean {
		return !!this.title && !!this.dueDate && !!this.category;
	}
}
