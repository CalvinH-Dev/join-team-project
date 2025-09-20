import { inject, Injectable } from "@angular/core";
import { DocumentData } from "@angular/fire/compat/firestore";
import {
	collection,
	collectionData,
	docData,
	Firestore,
	onSnapshot,
	QuerySnapshot,
} from "@angular/fire/firestore";
import { doc } from "firebase/firestore";
import { Contact } from "../interfaces/contact";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	firestore = inject(Firestore);

	contacts: Contact[] = [];
	unsubscribe: (() => void) | null = null;

	constructor() {
		const contactsCol = collection(this.firestore, "contacts");

		this.unsubscribe = onSnapshot(contactsCol, (snapshot: QuerySnapshot<DocumentData>) => {
			this.contacts = [];

			snapshot.forEach((doc) => {
				this.contacts.push({
					id: doc.id,
					name: doc.data()["name"] || "",
					email: doc.data()["email"] || "",
					telephone: doc.data()["telephone"] || "",
					initials: doc.data()["initials"] || "",
					color: doc.data()["color"] || 1,
				});
			});
		});
	}

	getContacts() {
		const contactsCol = collection(this.firestore, "contacts");
		return collectionData(contactsCol, { idField: "id" });
	}

	getDocumentById(contactId: string) {
		const docRef = doc(this.firestore, "contacts", contactId);
		return docData(docRef, { idField: "id" });
		// const docSnap = await getDoc(docRef);

		// if (docSnap.exists()) {
		// 	const docObj = {
		// 		id: docSnap.id,
		// 		name: docSnap.data()?.["name"] || "",
		// 		email: docSnap.data()?.["email"] || "",
		// 		telephone: docSnap.data()?.["telephone"] || "",
		// 		initials: docSnap.data()?.["initials"] || "",
		// 		color: docSnap.data()?.["color"] || 1,
		// 	};
		// 	return docObj;
		// } else {
		// 	return { id: docSnap.id, name: "", email: "", telephone: "", initials: "", color: 1 };
		// }
	}
}
