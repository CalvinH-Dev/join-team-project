export interface MessageConfig {
  id: string;
  type: 'validation' | 'error' | 'success' | 'warning' | 'info';
  message: string;
  field?: string;
  dismissible: boolean;
  duration?: number;
  icon?: string;
  position?: 'top' | 'bottom' | 'inline';
}

export interface ValidationMessage extends MessageConfig {
  type: 'validation';
  field: string;
  validationType: 'required' | 'email' | 'password' | 'format' | 'custom';
}

export interface InlineMessage extends MessageConfig {
  position: 'inline';
  targetElement?: HTMLElement;
}