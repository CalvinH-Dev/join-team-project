import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Contact } from "app/core/interfaces/contact";
import { Button } from '../components/button/button';

@Component({
	selector: "app-header",
	imports: [Button, RouterLink],
	templateUrl: "./header.html",
	styleUrl: "./header.scss",
})
export class Header {
	profile = input<Contact>();

  onAddContact(): void {
    console.log('Add contact clicked!');
    // Test function
  }

  onProfileClick(): void {
    console.log('Profile clicked!');
    // Handle profile dropdown or navigation
  }
}
