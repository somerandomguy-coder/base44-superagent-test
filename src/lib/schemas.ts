import { z } from 'zod';

export const KPICardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  changePercent: z.number(),
  trend: z.enum(['up', 'down', 'neutral']),
  color: z.enum(['violet', 'cyan', 'emerald', 'amber', 'rose']),
  subtitle: z.string(),
  icon: z.string(),
});

export const SentimentDataPointSchema = z.object({
  date: z.string(),
  positive: z.number().min(0),
  neutral: z.number().min(0),
  negative: z.number().min(0),
  nps: z.number(),
});

export const PaybackCdfPointSchema = z.object({
  weeks: z.number().min(0),
  probability: z.number().min(0).max(1), // CDF must be between 0 and 1
  featureName: z.string().min(1),
  expectedRetentionBoost: z.number().min(0),
});

export const CategoryBreakdownPointSchema = z.object({
  category: z.string().min(1),
  bugCount: z.number().min(0),
  featureRequestCount: z.number().min(0),
  urgentCount: z.number().min(0),
});

export const ActionItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  rationale: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'urgent']),
  impactScore: z.number().min(1).max(100),
  estimatedDays: z.number().min(1),
  suggestedAction: z.string().min(1),
  relatedCategory: z.string().min(1),
  githubIssueTemplate: z.object({
    title: z.string(),
    body: z.string(),
    labels: z.array(z.string()),
  }).optional(),
});

export const GenerativeDashboardSpecSchema = z.object({
  version: z.string().min(1),
  generatedAt: z.string().min(1),
  summary: z.object({
    headline: z.string().min(1),
    keyTakeaway: z.string().min(1),
    criticalAlertsCount: z.number().min(0),
    overallSentimentScore: z.number().min(0).max(100),
    statusHealth: z.enum(['healthy', 'warning', 'critical']),
  }),
  kpis: z.array(KPICardSchema).min(2),
  sentimentMomentum: z.array(SentimentDataPointSchema).min(3),
  featurePaybackCdf: z.object({
    targetWeeks: z.number().min(1),
    medianWeeks: z.number().min(1),
    featureName: z.string().min(1),
    curve: z.array(PaybackCdfPointSchema).min(3),
  }),
  categoryBreakdown: z.array(CategoryBreakdownPointSchema).min(2),
  actionItems: z.array(ActionItemSchema).min(1),
  modelMetadata: z.object({
    model: z.string(),
    promptTokens: z.number(),
    completionTokens: z.number(),
    latencyMs: z.number(),
    scratchpadIterations: z.number(),
    schemaValid: z.boolean(),
  }),
});

export type ValidatedDashboardSpec = z.infer<typeof GenerativeDashboardSpecSchema>;

export interface FormattedReflectionError {
  path: string;
  message: string;
  expected: string;
  received: string;
}

export function formatZodReflectionErrors(error: z.ZodError): FormattedReflectionError[] {
  return error.issues.map((err: z.ZodIssue) => {
    const pathStr = err.path.join('.');
    return {
      path: pathStr || 'root',
      message: err.message,
      expected: 'expected' in err ? String((err as unknown as { expected: unknown }).expected) : 'Valid schema constraint',
      received: 'received' in err ? String((err as unknown as { received: unknown }).received) : 'Invalid token/value',
    };
  });
}
