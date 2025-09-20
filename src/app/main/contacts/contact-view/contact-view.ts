import { Component, OnDestroy, inject } from "@angular/core";
// import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, onSnapshot, DocumentData, QuerySnapshot } from "@angular/fire/firestore";
import { Contact } from "../../../core/interfaces/contact";

@Component({
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})
export class ContactView implements OnDestroy {
	contactData?: Contact;
	intials = "";
	color = "";

	firestore = inject(Firestore);
	unsubscribe: (() => void) | null = null;

	constructor() {
		const contactsCol = collection(this.firestore, "contacts");

		
		this.unsubscribe = onSnapshot(contactsCol, (snapshot: QuerySnapshot<DocumentData>) => {
			const contacts: Contact[] = [];

			snapshot.forEach((doc) => {
				contacts.push({
					id: doc.id,
					name: doc.data()["name"] || "",
					email: doc.data()["email"] || "",
					telephone: doc.data()["telephone"] || "",
					intials: doc.data()["intials"] || "",
					// color: doc.data()["color"]?.toString() || "#ff8c00",
				});
			});

			if (contacts.length > 0) {
				this.contactData = contacts[0];
				this.intials = this.contactData.intials || "";
				// this.color = this.contactData.color?.toString() || "#ff8c00";
			}
		});
	}

	
	ngOnDestroy() {
		this.unsubscribe?.();
	}
}
