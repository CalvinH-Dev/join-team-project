import { CommonModule, Location, ViewportScroller } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
	vps = inject(ViewportScroller);
	route = inject(ActivatedRoute);
	router = inject(Router);
	id = this.route.snapshot.paramMap.get("id") || "";
	showList = true;
	private location = inject(Location);

	isAddContactOpen = false;

	onAddContactClicked() {
		this.isAddContactOpen = true;
	}

	onAddContactClosed() {
		this.isAddContactOpen = false;
	}

	onContactCreated(id: string) {
		if (!id) return;
		this.location.replaceState("/contacts", `id=${id}`);
		this.vps.scrollToAnchor(id, { behavior: "smooth" });
	}

	constructor() {
		this.location.onUrlChange((url) => {
			this.id = url.split("?")[1]?.split("id=")[1];

			if (this.id) {
				this.showList = false;
			} else {
				this.showList = true;
			}
		});
	}
}
