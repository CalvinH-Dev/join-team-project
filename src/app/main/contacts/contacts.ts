import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ContactList } from "./contact-list/contact-list";
import { ContactView } from "./contact-view/contact-view";
import { AddContact } from "./add-contact/add-contact";

@Component({
	selector: "app-contacts",
	imports: [ContactList, ContactView, AddContact],
	templateUrl: "./contacts.html",
	styleUrl: "./contacts.scss",
})
export class Contacts {
	route = inject(ActivatedRoute);
	id = this.route.snapshot.paramMap.get("id") || "";
	showList = true;

	constructor() {
		this.route.params.subscribe((params) => {
			if (!params["id"]) {
				this.showList = true;
			} else {
				this.showList = false;
			}

			this.id = params["id"];
		});
	}
}
