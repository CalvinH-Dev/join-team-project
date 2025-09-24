import { Component, inject, input, OnChanges, signal } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { Button } from "@shared/components/button/button";
import { ContactMenu } from "@shared/components/contact-menu/contact-menu";
import { ToastService } from "@shared/services/toast.service";
import { ToastAction } from "@shared/components/toast/toast";
import { ContactService } from "app/core/services/contact-service";
import { EditContact } from "../edit-contact/edit-contact";

@Component({
	imports: [Button, ContactMenu, EditContact],
	selector: "app-contact-view",
	templateUrl: "./contact-view.html",
	styleUrls: ["./contact-view.scss"],
	standalone: true,
})
export class ContactView implements OnChanges {


	firestore = inject(Firestore);
	contactService = inject(ContactService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	toastService = inject(ToastService);
	id = input<string>("");
	isEditOverlayOpen = signal(false);
	onEditContactId = signal("");

	// For two-step delete confirmation
	private deleteConfirmationContactId: string | null = null;
	private deleteConfirmationTimeout?: number;

	ngOnChanges() {
		if (this.id()) {
			this.contactService.getDocumentById(this.id());
		} else {
			this.contactService.contactForView = undefined;
		}
	}

	goBack() {
		this.router.navigate(["/contacts"]);
	}

	// Öffnet das Overlay und setzt die ID
	onEditContact(contactId: string): void {
		this.onEditContactId.set(contactId);
		this.isEditOverlayOpen.set(true);
	}

	onEditContactSaved(): void {
		this.onCloseEditOverlay();
		this.toastService.showSuccess("Contact edited successfully");
	}

	async onDeleteContact(contactId: string) {
		if (!contactId) return;

		if (this.deleteConfirmationContactId === contactId) {
			// User clicked delete while confirmation toast is already shown
			// This shouldn't happen with new UX, but keep as fallback
			this.performDelete(contactId);
		} else {
			// First delete tap - show clickable confirmation toast
			this.deleteConfirmationContactId = contactId;

			const confirmAction: ToastAction = {
				label: "Delete",
				handler: () => this.performDelete(contactId)
			};

			this.toastService.showWarningWithAction(
				"Delete this contact?",
				confirmAction
			);

			this.deleteConfirmationTimeout = setTimeout(() => {
				this.resetDeleteConfirmation();
			}, 5000);
		}
	}

	private async performDelete(contactId: string) {
		try {
			await this.contactService.deleteContact(contactId);
			this.toastService.showSuccess("Contact deleted successfully");
			this.resetDeleteConfirmation();
			this.goBack();
		} catch {
			this.toastService.showError("Failed to delete contact. Please try again.");
			this.resetDeleteConfirmation();
		}
	}

	private resetDeleteConfirmation() {
		this.deleteConfirmationContactId = null;
		if (this.deleteConfirmationTimeout) {
			clearTimeout(this.deleteConfirmationTimeout);
			this.deleteConfirmationTimeout = undefined;
		}
	}
  
  onCloseEditOverlay() {
    this.isEditOverlayOpen.set(false);
  }
}
