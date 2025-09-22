import { Component, Input, Output, EventEmitter, computed } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'edit' | 'delete' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() icon?: string;
  @Input() iconAlt?: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;

  @Output() clickEvent = new EventEmitter<MouseEvent>();

  // Angular 20 computed signal for dynamic classes
  protected buttonClasses = computed(() => {
    const classes = ['btn'];

    // Variant class
    classes.push(`btn--${this.variant}`);

    // Size class (only if not default medium)
    if (this.size !== 'medium') {
      classes.push(`btn--${this.size}`);
    }

    // State classes
    if (this.fullWidth) {
      classes.push('btn--full-width');
    }

    if (this.loading) {
      classes.push('btn--loading');
    }

    return classes.join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clickEvent.emit(event);
    }
  }
}
