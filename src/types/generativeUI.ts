export interface KPICardSpec {
  id: string;
  title: string;
  value: string | number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';
  subtitle: string;
  icon: string;
}

export interface SentimentDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  nps: number;
}

export interface PaybackCdfPoint {
  weeks: number;
  probability: number; // 0.0 to 1.0
  featureName: string;
  expectedRetentionBoost: number;
}

export interface CategoryBreakdownPoint {
  category: string;
  bugCount: number;
  featureRequestCount: number;
  urgentCount: number;
}

export interface ActionItemSpec {
  id: string;
  title: string;
  rationale: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  impactScore: number; // 1 - 100
  estimatedDays: number;
  suggestedAction: string;
  relatedCategory: string;
  githubIssueTemplate?: {
    title: string;
    body: string;
    labels: string[];
  };
}

export interface GenerativeDashboardSpec {
  version: string;
  generatedAt: string;
  summary: {
    headline: string;
    keyTakeaway: string;
    criticalAlertsCount: number;
    overallSentimentScore: number; // 0.0 - 100.0
    statusHealth: 'healthy' | 'warning' | 'critical';
  };
  kpis: KPICardSpec[];
  sentimentMomentum: SentimentDataPoint[];
  featurePaybackCdf: {
    targetWeeks: number;
    medianWeeks: number;
    featureName: string;
    curve: PaybackCdfPoint[];
  };
  categoryBreakdown: CategoryBreakdownPoint[];
  actionItems: ActionItemSpec[];
  modelMetadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    scratchpadIterations: number;
    schemaValid: boolean;
  };
}
