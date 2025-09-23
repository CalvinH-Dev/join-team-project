import { KeyValuePipe } from "@angular/common";
import { Component, EventEmitter, inject, Output, output } from "@angular/core";
import { Router } from "@angular/router";
import { ContactService } from "app/core/services/contact-service";
import { Button } from "../../../shared/components/button/button";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	selector: "app-contact-list",
	imports: [KeyValuePipe, Button],
	templateUrl: "./contact-list.html",
	styleUrl: "./contact-list.scss",
})
export class ContactList {
	contactService = inject(ContactService);
	router = inject(Router);
	toastService = inject(ToastService);

	@Output() addContactClicked = new EventEmitter<void>();

	openAddContact() {
		this.addContactClicked.emit();
	}


	contactSelected = output<string>();

	onContactSelect(id: string | undefined) {
		if (!id) return;
		this.router.navigate(["/contacts", id]);
	}

	onAddNewContact() {
		console.log('Add new contact clicked!');

		// Test: Show toast animation
		this.toastService.showSuccess(
			'contact successfully created'
		);

		// TODO: This will later trigger the actual add contact functionality
		// this.router.navigate(["/contacts/add"]);
	}
}
