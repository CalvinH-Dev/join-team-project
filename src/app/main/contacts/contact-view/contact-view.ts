import { Component, inject, OnInit } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { ContactService } from "app/core/services/contact-service";

@Component({
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
})
export class ContactView implements OnInit {
	firestore = inject(Firestore);
	contactService = inject(ContactService);
	route = inject(ActivatedRoute);

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			const id = params.get("id");
			if (id) {
				this.contactService.getDocumentById(id);
			}
		});
	}
}
