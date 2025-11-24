export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  favorite: boolean;
}

export interface AIResponse {
  title?: string;
  description?: string;
  tags?: string[];
}