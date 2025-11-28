export type ItemType = 'trade' | 'news' | 'resource';
export type TradeDirection = 'long' | 'short';
export type TradeOutcome = 'win' | 'loss' | 'be' | 'pending';

export interface TerminalItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  favorite: boolean;
  // New fields
  type: ItemType;
  pair?: string;
  direction?: TradeDirection;
  outcome?: TradeOutcome;
  pnl?: number;
  screenshot_url?: string;

  // Extended Trade Fields
  entry_price?: number;
  exit_price?: number;
  quantity?: number;
  fees?: number;
  stop_loss?: number;
  take_profit?: number;
  entry_date?: string;
  exit_date?: string;
  notes?: string;
}

// Alias for backward compatibility
export type LinkItem = TerminalItem;

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
  pair?: string; // AI might detect this
}

export interface AppSettings {
  startingBalance: number;
  currency: string;
}

export type EconomicImpact = 'low' | 'medium' | 'high';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'NZD';

export interface EconomicEvent {
  id: string;
  time: string; // HH:MM format
  date: string; // ISO date string
  currency: Currency;
  event: string;
  impact: EconomicImpact;
  forecast: string;
  previous: string;
  actual?: string;
}