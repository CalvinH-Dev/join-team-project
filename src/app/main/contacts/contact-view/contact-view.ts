import { Component, inject } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ContactService } from "app/core/services/contact-service";

@Component({
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})
export class ContactView {
	firestore = inject(Firestore);
	contactService = inject(ContactService);

	constructor() {
		this.contactService.getDocumentById("1pBp6LKabOGB5sN1A4D6");
	}
}
