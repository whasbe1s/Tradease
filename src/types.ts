export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  favorite: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onUndo?: () => void;
}

export interface AIResponse {
  title?: string;
  description?: string;
  tags?: string[];
}