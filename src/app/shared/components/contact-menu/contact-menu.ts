import { Component, Input, Output, EventEmitter, signal, HostListener, ElementRef, inject } from '@angular/core';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-contact-menu',
  imports: [Button],
  templateUrl: './contact-menu.html',
  styleUrl: './contact-menu.scss'
})
export class ContactMenu {
  @Input() contactId?: string;

  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  // Signals for animation states
  public isMenuOpen = signal(false);
  public isMenuVisible = signal(false);
  public isMenuHiding = signal(false);

  // Inject ElementRef for click-outside detection
  private elementRef = inject(ElementRef);
  private hideTimeout?: number;

  toggleMenu(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    // Clear any pending hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }

    this.isMenuOpen.set(true);
    this.isMenuHiding.set(false);

    // Start slide-in animation immediately
    setTimeout(() => {
      this.isMenuVisible.set(true);
    }, 10); // Small delay to ensure CSS transition works
  }

  private closeMenu(): void {
    this.isMenuVisible.set(false);
    this.isMenuHiding.set(true);

    // Wait for animation to complete before updating menu state
    this.hideTimeout = setTimeout(() => {
      this.isMenuOpen.set(false);
      this.isMenuHiding.set(false);
      this.hideTimeout = undefined;
    }, 300); // Match CSS transition duration
  }

  onEdit(): void {
    if (this.contactId) {
      this.editClicked.emit(this.contactId);
      this.closeMenu(); // Close menu with animation after action
    }
  }

  onDelete(): void {
    if (this.contactId) {
      this.deleteClicked.emit(this.contactId);
      this.closeMenu(); // Close menu with animation after action
    }
  }

  // Click outside to close menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isMenuOpen()) {
      const target = event.target as Element;
      // Check if click is outside this component
      if (!this.elementRef.nativeElement.contains(target)) {
        this.closeMenu();
      }
    }
  }

  // Close menu on Escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}