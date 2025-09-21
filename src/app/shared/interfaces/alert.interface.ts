export interface AlertConfig {
  id: string;
  type: 'system' | 'security' | 'connectivity' | 'feature';
  title?: string;
  message: string;
  dismissible: boolean;
  persistent: boolean;
  priority: 'low' | 'medium' | 'high';
  actions?: AlertAction[];
  customClass?: string;
}

export interface AlertAction {
  label: string;
  handler: () => void;
  variant?: 'primary' | 'secondary';
}

export interface Alert extends AlertConfig {
  timestamp: number;
  dismissed: boolean;
}