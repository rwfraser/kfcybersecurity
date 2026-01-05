export interface Service {
  id: number;
  name: string;
  vertical: 'Identify' | 'Protect' | 'Detect' | 'Respond' | 'Recover' | 'Govern';
  desc: string;
  price: string;
}

export interface ActiveDeployments {
  [clientName: string]: number[];
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
