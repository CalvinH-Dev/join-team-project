import { KeyValuePipe } from "@angular/common";
import { Component, inject, OnDestroy, output } from "@angular/core";
import { DocumentData } from "@angular/fire/compat/firestore";
import {
	collection,
	Firestore,
	onSnapshot,
	QueryDocumentSnapshot,
	QuerySnapshot,
} from "@angular/fire/firestore";
import { Contact } from "app/core/interfaces/contact";

type ContactDictionary = Record<string, Contact[]>;

@Component({
	selector: "app-contact-list",
	imports: [KeyValuePipe],
	templateUrl: "./contact-list.html",
	styleUrl: "./contact-list.scss",
})
export class ContactList implements OnDestroy {
	db = inject(Firestore);

	contacts: Contact[] = [];
	unsubscribeContacts = () => {
		/* empty */
	};

	lexObject: ContactDictionary = {};

	contactSelected = output<string>();

	constructor() {
		const aCollection = collection(this.db, "contacts");
		this.unsubscribeContacts = onSnapshot(aCollection, this.getDocuments);
	}

	getDocuments = (docs: QuerySnapshot<DocumentData, DocumentData>) => {
		this.contacts = [];
		docs.forEach((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
			const obj = this.buildDocument(doc.id, doc.data());
			const firstLetter: string = obj.name.trim().charAt(0);

			if (!firstLetter) return;

			if (!this.lexObject[firstLetter]) {
				this.lexObject[firstLetter] = [];
			}

			this.lexObject[firstLetter].push(obj);
		});
	};

	buildDocument(id: string, data: DocumentData): Contact {
		return {
			id,
			name: data["name"] || "",
			email: data["email"] || "",
			telephone: data["telephone"] || "",
			initials: data["initials"] || "",
			color: data["color"] || 1,
		};
	}

	onContactSelect(id: string | undefined) {
		if (!id) return;
		this.contactSelected.emit(id);
	}

	ngOnDestroy() {
		this.unsubscribeContacts();
	}
}
