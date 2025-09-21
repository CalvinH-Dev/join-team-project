import { Component, inject } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { ContactService } from "app/core/services/contact-service";

@Component({
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})
export class ContactView {
	firestore = inject(Firestore);
	contactService = inject(ContactService);
	route = inject(ActivatedRoute);

	constructor() {
		// Use snapshot to get the ID only once
		const id = this.route.snapshot.paramMap.get("id");
		if (id) {
			this.contactService.getDocumentById(id);
		}

		// paramMap.subscribe is only needed for dynamic updates while the component is reused

		// ngOnInit(): void {
		// 	this.route.paramMap.subscribe((params) => {
		// 		const id = params.get("id");
		// 		if (id) {
		// 			this.contactService.getDocumentById(id);
		// 		}
		// 	});
	}
}
