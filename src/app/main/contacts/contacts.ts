import { CommonModule } from "@angular/common";
import { Component, HostBinding } from "@angular/core";
import { AddContact } from "./add-contact/add-contact";
import { ContactList } from "./contact-list/contact-list";
import { ContactView } from "./contact-view/contact-view";

@Component({
	selector: "app-contacts",
	imports: [ContactList, ContactView, AddContact, CommonModule],
	templateUrl: "./contacts.html",
	styleUrl: "./contacts.scss",
})
export class Contacts {
	// Component-State Navigation (like working project)
	activeContactId: string | undefined = undefined;
	isAddContactOpen = false;

	// HostBinding for CSS classes (no dynamic class bindings)
	@HostBinding('class.display-contact-list')
	displayContactList = true;

	@HostBinding('class.display-single-contact')
	displaySingleContact = false;

	onAddContactClicked() {
		this.isAddContactOpen = true;
	}

	onAddContactClosed() {
		this.isAddContactOpen = false;
	}

	onContactCreated(id: string) {
		if (!id) return;
		// Component-State Navigation instead of Router
		this.activeContactId = id;
		this.showSingleContact();
	}

	// Event-based navigation methods
	onContactSelected(contactId: string | undefined) {
		this.activeContactId = contactId;
		if (contactId) {
			this.showSingleContact();
		} else {
			this.showContactList();
		}
	}

	showContactList() {
		this.displayContactList = true;
		this.displaySingleContact = false;
	}

	showSingleContact() {
		this.displayContactList = false;
		this.displaySingleContact = true;
	}
}
