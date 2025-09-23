import { Component, inject, input, OnChanges } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { ContactService } from "app/core/services/contact-service";
import { ContactMenu } from "@shared/components/contact-menu/contact-menu";

@Component({
	selector: "app-contact-view",
	imports: [ContactMenu],
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})

export class ContactView implements OnChanges {
	firestore = inject(Firestore);
	contactService = inject(ContactService);
	route = inject(ActivatedRoute);
	id = input<string>("");

	ngOnChanges() {
		if (this.id()) {
			this.contactService.getDocumentById(this.id());
		}
	}

	onEditContact(contactId: string): void {
		console.log('Edit contact:', contactId);
		// TODO: Implement edit functionality
	}

	onDeleteContact(contactId: string): void {
		console.log('Delete contact:', contactId);
		// TODO: Implement delete functionality
	}
}
