import { KeyValuePipe } from "@angular/common";
import { Component, inject, output } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ContactService } from "app/core/services/contact-service";

@Component({
	selector: "app-contact-list",
	imports: [KeyValuePipe],
	templateUrl: "./contact-list.html",
	styleUrl: "./contact-list.scss",
})
export class ContactList {
	db = inject(Firestore);
	contactService = inject(ContactService);

	contactSelected = output<string>();

	onContactSelect(id: string | undefined) {
		if (!id) return;
		this.contactSelected.emit(id);
	}
}
