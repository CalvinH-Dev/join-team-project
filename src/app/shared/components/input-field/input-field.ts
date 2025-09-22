import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [FormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss'
})
export class InputField {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'number' = 'text';
  @Input() icon?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showPasswordToggle = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  // Angular 20 signals
  protected value = signal('');
  protected passwordVisible = signal(false);
  protected isFocused = signal(false);
  protected hasError = signal(false);

  // Computed properties
  protected inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

  protected inputClasses = computed(() => {
    const classes = ['input__field'];

    if (this.size !== 'medium') {
      classes.push(`input__field--${this.size}`);
    }

    if (!this.icon) {
      classes.push('input__field--no-icon');
    }

    if (this.hasError()) {
      classes.push('input__field--error');
    }

    return classes.join(' ');
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.valueChange.emit(target.value);

    // Reset error state on input
    if (this.hasError()) {
      this.hasError.set(false);
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focus.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.blur.emit();

    // Validate on blur
    this.validateInput();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  private validateInput(): void {
    const currentValue = this.value();

    if (this.required && !currentValue.trim()) {
      this.hasError.set(true);
      return;
    }

    if (this.type === 'email' && currentValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.hasError.set(!emailRegex.test(currentValue));
      return;
    }

    this.hasError.set(false);
  }

  // Public methods
  setError(hasError: boolean): void {
    this.hasError.set(hasError);
  }

  setValue(newValue: string): void {
    this.value.set(newValue);
  }

  getValue(): string {
    return this.value();
  }
}
