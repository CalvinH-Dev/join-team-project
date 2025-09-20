import { Component, OnDestroy, inject } from "@angular/core";
// import { ActivatedRoute } from '@angular/router';
import { Firestore } from "@angular/fire/firestore";
import { ContactService } from "app/core/services/contact-service";
import { Contact } from "../../../core/interfaces/contact";

@Component({
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})
export class ContactView implements OnDestroy {
	contactData?: Contact;
	contactData$: any;
	initials = "";
	color = "";

	firestore = inject(Firestore);
	contactService = inject(ContactService);
	unsubscribe: (() => void) | null = null;

	constructor() {
		console.log("hey");
		// const contactsCol = collection(this.firestore, "contacts");

		// this.unsubscribe = onSnapshot(contactsCol, (snapshot: QuerySnapshot<DocumentData>) => {
		// 	const contacts: Contact[] = [];

		// 	snapshot.forEach((doc) => {
		// 		contacts.push({
		// 			id: doc.id,
		// 			name: doc.data()["name"] || "",
		// 			email: doc.data()["email"] || "",
		// 			telephone: doc.data()["telephone"] || "",
		// 			initials: doc.data()["initials"] || "",
		// 			color: doc.data()["color"]?.toString() || "#ff8c00",
		// 		});
		// 	});

		// const contacts = this.contactService.contacts;

		// if (contacts.length > 0) {
		this.contactData$ = this.contactService.getDocumentById("8AZH7kzGuMQMkI1tD0p8");
		this.contactData$.subscribe((document: any) => {
			console.log(document);
			this.contactData = document;
		});
		// this.initials = this.contactData.initials || "";
		// this.color = this.contactData.color?.toString() || "#ff8c00";
		// }
		// });
	}

	ngOnDestroy() {
		this.unsubscribe?.();
	}
}
