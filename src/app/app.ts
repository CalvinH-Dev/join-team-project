import { Component,inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { collection, Firestore, onSnapshot } from "@angular/fire/firestore";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("join");

	 db = inject(Firestore);
	
	constructor() {
		const items = collection(this.db, "contact");

		const snapshots = onSnapshot(items, (contact) => {
			contact.forEach((contacts) => {
				console.log(contacts.data());				
			});
		});
		console.log(items);
		
	}
}
