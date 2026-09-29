export type FeedbackSource = 'discord' | 'github' | 'appstore' | 'intercom' | 'base44_telemetry';

export type FeedbackSentiment = 'positive' | 'neutral' | 'negative' | 'critical';

export type FeedbackCategory = 
  | 'performance' 
  | 'ui_ux' 
  | 'database' 
  | 'ai_superagent' 
  | 'auth' 
  | 'pricing' 
  | 'feature_request';

export interface FeedbackItem {
  id: string;
  source: FeedbackSource;
  author: string;
  avatarUrl?: string;
  content: string;
  sentiment: FeedbackSentiment;
  sentimentScore: number; // 0.0 to 1.0 (1.0 = highly positive, 0.0 = critical crash)
  category: FeedbackCategory;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  tags: string[];
  triaged: boolean;
  churnRisk: boolean;
  metadata?: {
    browser?: string;
    os?: string;
    version?: string;
    reproducible?: boolean;
    upvotes?: number;
  };
}
