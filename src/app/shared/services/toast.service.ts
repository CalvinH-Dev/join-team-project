import { Injectable, signal } from '@angular/core';
import { ToastAction } from '@shared/components/toast/toast';

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  icon?: string;
  persistent?: boolean;
  action?: ToastAction;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Signal to hold current toast
  protected currentToast = signal<ToastConfig | null>(null);

  // Public getter for components to subscribe to
  get toast() {
    return this.currentToast.asReadonly();
  }

  // Show a success toast
  showSuccess(message: string, title?: string): void {
    this.show({
      type: 'success',
      message,
      title,
      duration: 1500
    });
  }

  // Show an error toast
  showError(message: string, title?: string): void {
    this.show({
      type: 'error',
      message,
      title,
      duration: 5000
    });
  }

  // Show a warning toast
  showWarning(message: string, title?: string): void {
    this.show({
      type: 'warning',
      message,
      title,
      duration: 4000
    });
  }

  // Show a warning toast with action button
  showWarningWithAction(message: string, action: ToastAction, title?: string): void {
    this.show({
      type: 'warning',
      message,
      title,
      action,
      duration: 5000
    });
  }

  // Show an info toast
  showInfo(message: string, title?: string): void {
    this.show({
      type: 'info',
      message,
      title,
      duration: 4000
    });
  }

  // Generic show method
  show(config: ToastConfig): void {
    this.currentToast.set(config);
  }

  // Hide current toast
  hide(): void {
    this.currentToast.set(null);
  }
}