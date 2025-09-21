export interface ToastConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showCloseButton: boolean;
  icon?: string;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast extends ToastConfig {
  timestamp: number;
}