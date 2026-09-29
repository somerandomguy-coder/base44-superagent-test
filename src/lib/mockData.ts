import { FeedbackItem } from '@/types/feedback';
import { GenerativeDashboardSpec } from '@/types/generativeUI';
import { StageDefinition } from '@/types/stateMachine';

export const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 'INGESTING',
    label: '1. Ingesting',
    shortDesc: 'Multi-Channel Feed Collector',
    description: 'Polls & listens to GitHub issues, Discord webhook feeds, App Store reviews, and Base44 telemetry events.',
    subagentName: 'IngestWatcher-v3',
    iconName: 'Inbox',
  },
  {
    id: 'TRIAGING',
    label: '2. Triaging',
    shortDesc: 'Classification & Sentiment Analysis',
    description: 'Runs zero-shot intent classifier, assigns severity tags (P0/P1/P2), extracts entity embeddings, and flags churn risks.',
    subagentName: 'TriageClassifier-v2',
    iconName: 'Filter',
  },
  {
    id: 'BATCH_BUFFER',
    label: '3. Batch Buffer',
    shortDesc: 'Deduplication & Clustering',
    description: 'Groups semantic duplicates via cosine distance vector clustering; builds debounced execution micro-batches.',
    subagentName: 'BatchClusterDeno-v1',
    iconName: 'Layers',
  },
  {
    id: 'SYNTHESIZING',
    label: '4. Synthesizing',
    shortDesc: 'Declarative Generative UI Spec',
    description: 'Generates structured KPI metrics, sentiment trajectory, payback CDF curves, and prioritized engineering action items.',
    subagentName: 'SynthesizerSuperagent-Pro',
    iconName: 'Cpu',
  },
  {
    id: 'VALIDATING',
    label: '5. Validating',
    shortDesc: 'Scratchpad Reflection & Self-Healing',
    description: 'Enforces strict Zod runtime schema contracts. If an AST or type mismatch is caught, feeds reflection diff back to model for auto-correction.',
    subagentName: 'ZodGuardScratchpad-v4',
    iconName: 'ShieldCheck',
  },
  {
    id: 'LIVE_DEPLOY',
    label: '6. Live Deploy',
    shortDesc: 'Hot-Swap Generative UI',
    description: 'Zero-downtime hot-swap of the live dashboard widgets with WebSocket event broadcasting to connected frontend clients.',
    subagentName: 'EdgeDeployer-Deno',
    iconName: 'Zap',
  },
];

export const INITIAL_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb-001',
    source: 'github',
    author: 'alex_dev_99',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    content: 'Deno backend edge functions fail to resolve mongodb connection pool during cold-start concurrency bursts over 40 req/s. Need automatic keep-alive.',
    sentiment: 'negative',
    sentimentScore: 0.18,
    category: 'database',
    severity: 'urgent',
    timestamp: '2 mins ago',
    tags: ['deno-edge', 'mongodb', 'cold-start', 'concurrency'],
    triaged: true,
    churnRisk: true,
    metadata: { os: 'Linux', version: 'v2.4.1', upvotes: 14 }
  },
  {
    id: 'fb-002',
    source: 'discord',
    author: 'sarah_founder',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    content: 'The Superagent feature just built my entire feedback funnel in 45 seconds!! Mind blown. Would love a 1-click export to our internal Jira or Linear.',
    sentiment: 'positive',
    sentimentScore: 0.96,
    category: 'feature_request',
    severity: 'low',
    timestamp: '5 mins ago',
    tags: ['superagent', 'linear-export', 'delight', 'nps-promoter'],
    triaged: true,
    churnRisk: false,
    metadata: { upvotes: 28 }
  },
  {
    id: 'fb-003',
    source: 'base44_telemetry',
    author: 'system_probe',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    content: 'Client-side render latency spike detected in Recharts Payback CDF chart when dataset exceeds 500 points on Safari iOS 17.',
    sentiment: 'neutral',
    sentimentScore: 0.45,
    category: 'performance',
    severity: 'medium',
    timestamp: '8 mins ago',
    tags: ['telemetry', 'safari-ios', 'render-fps', 'recharts'],
    triaged: true,
    churnRisk: false,
    metadata: { browser: 'Mobile Safari 17.4', os: 'iOS' }
  },
  {
    id: 'fb-004',
    source: 'intercom',
    author: 'marcus_enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    content: 'We need Row-Level Security (RLS) enforcement at the Superagent tool level. Right now user-tenants might see aggregated telemetry without team isolation.',
    sentiment: 'critical',
    sentimentScore: 0.08,
    category: 'ai_superagent',
    severity: 'urgent',
    timestamp: '14 mins ago',
    tags: ['enterprise-security', 'rls', 'tenant-isolation', 'compliance'],
    triaged: true,
    churnRisk: true,
    metadata: { version: 'Enterprise Tier', upvotes: 9 }
  },
  {
    id: 'fb-005',
    source: 'appstore',
    author: 'jordan_builder',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
    content: 'The new dark mode UI is gorgeous, especially the glassmorphism dashboard cards. Makes monitoring our app telemetry actually enjoyable.',
    sentiment: 'positive',
    sentimentScore: 0.92,
    category: 'ui_ux',
    severity: 'low',
    timestamp: '22 mins ago',
    tags: ['ui', 'dark-mode', 'satisfaction'],
    triaged: true,
    churnRisk: false,
    metadata: { os: 'macOS Sonoma' }
  },
  {
    id: 'fb-006',
    source: 'github',
    author: 'elena_scale',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
    content: 'Auth token refresh loop occurs when OAuth session cookie expires mid-request. Users get bounced to login screen without saving state.',
    sentiment: 'negative',
    sentimentScore: 0.22,
    category: 'auth',
    severity: 'high',
    timestamp: '35 mins ago',
    tags: ['jwt', 'oauth-refresh', 'session-drop'],
    triaged: true,
    churnRisk: true,
    metadata: { browser: 'Chrome 122', version: 'v2.4.0' }
  },
  {
    id: 'fb-007',
    source: 'discord',
    author: 'chen_growth',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80',
    content: 'Is there a way to auto-classify feedback by pricing tier? We want higher weight given to $1k/mo ARR teams during triage prioritization.',
    sentiment: 'neutral',
    sentimentScore: 0.58,
    category: 'pricing',
    severity: 'low',
    timestamp: '48 mins ago',
    tags: ['pricing-weight', 'arr-tiering', 'superagent-weights'],
    triaged: true,
    churnRisk: false,
    metadata: { upvotes: 19 }
  },
];

export const INITIAL_DASHBOARD_SPEC: GenerativeDashboardSpec = {
  version: '2.5.0-declarative',
  generatedAt: new Date().toISOString(),
  summary: {
    headline: 'High Velocity Feedback Pulse: Database Concurrency & RLS Prioritized',
    keyTakeaway: 'Overall NPS is stabilizing at +48, but 2 high-risk enterprise escalations around Deno MongoDB pooling and Superagent tenant isolation require immediate sprint allocation.',
    criticalAlertsCount: 2,
    overallSentimentScore: 74.2,
    statusHealth: 'warning',
  },
  kpis: [
    {
      id: 'kpi-nps',
      title: 'Net Sentiment Momentum',
      value: '+48 NPS',
      changePercent: 12.4,
      trend: 'up',
      color: 'emerald',
      subtitle: '83% positive / neutral across 7 channels',
      icon: 'Smile',
    },
    {
      id: 'kpi-triage',
      title: 'Triage Mean Latency',
      value: '420ms',
      changePercent: -34.8,
      trend: 'up',
      color: 'cyan',
      subtitle: 'Zero-shot classification on Deno isolates',
      icon: 'Zap',
    },
    {
      id: 'kpi-urgent',
      title: 'Critical Churn Signals',
      value: '2 Issues',
      changePercent: 0,
      trend: 'neutral',
      color: 'rose',
      subtitle: 'Database cold-start & Multi-tenant RLS',
      icon: 'AlertTriangle',
    },
    {
      id: 'kpi-reflection',
      title: 'Scratchpad Self-Heal Rate',
      value: '99.8%',
      changePercent: 4.2,
      trend: 'up',
      color: 'violet',
      subtitle: '100% schema compliance pre-deploy',
      icon: 'ShieldCheck',
    },
  ],
  sentimentMomentum: [
    { date: 'Mon', positive: 65, neutral: 25, negative: 10, nps: 55 },
    { date: 'Tue', positive: 58, neutral: 28, negative: 14, nps: 44 },
    { date: 'Wed', positive: 72, neutral: 20, negative: 8, nps: 64 },
    { date: 'Thu', positive: 45, neutral: 30, negative: 25, nps: 20 },
    { date: 'Fri', positive: 68, neutral: 22, negative: 10, nps: 58 },
    { date: 'Sat', positive: 79, neutral: 16, negative: 5, nps: 74 },
    { date: 'Sun (Live)', positive: 74, neutral: 18, negative: 8, nps: 66 },
  ],
  featurePaybackCdf: {
    targetWeeks: 4,
    medianWeeks: 3.2,
    featureName: 'Multi-Tenant RLS & 1-Click Linear Integration',
    curve: [
      { weeks: 1, probability: 0.12, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 4.5 },
      { weeks: 2, probability: 0.38, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 11.2 },
      { weeks: 3, probability: 0.72, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 19.8 },
      { weeks: 4, probability: 0.89, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 26.4 },
      { weeks: 5, probability: 0.96, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 30.1 },
      { weeks: 6, probability: 0.99, featureName: 'RLS & Linear Bridge', expectedRetentionBoost: 32.5 },
    ],
  },
  categoryBreakdown: [
    { category: 'AI Superagent', bugCount: 4, featureRequestCount: 18, urgentCount: 1 },
    { category: 'Database & RLS', bugCount: 7, featureRequestCount: 12, urgentCount: 2 },
    { category: 'Performance', bugCount: 5, featureRequestCount: 9, urgentCount: 0 },
    { category: 'UI / UX Design', bugCount: 2, featureRequestCount: 15, urgentCount: 0 },
    { category: 'Auth / OAuth', bugCount: 6, featureRequestCount: 4, urgentCount: 1 },
    { category: 'Pricing & Tiers', bugCount: 1, featureRequestCount: 8, urgentCount: 0 },
  ],
  actionItems: [
    {
      id: 'act-01',
      title: 'Fix Deno MongoDB Pool Cold-Start Connection Pooling',
      rationale: 'Reported by alex_dev_99 with 14 upvotes. Concurrency spikes above 40 req/s trigger handshake timeouts.',
      severity: 'urgent',
      impactScore: 94,
      estimatedDays: 2,
      suggestedAction: 'Provision Deno Subhosting connection cache singleton and configure maxIdleTimeMS: 5000.',
      relatedCategory: 'Database & RLS',
      githubIssueTemplate: {
        title: 'fix(deno-db): maintain pooled mongodb sockets across serverless cold starts',
        body: '## Root Cause\nEphemeral Deno isolates tear down TCP connections without recycling socket descriptors.\n\n## Acceptance Criteria\n- Socket pooling enabled\n- Latency <= 45ms at 50 req/s\n- Zero cold start dropouts',
        labels: ['p0-critical', 'backend-deno', 'mongodb'],
      },
    },
    {
      id: 'act-02',
      title: 'Implement Row-Level Security in Superagent Tool Invocation Pipeline',
      rationale: 'Enterprise tenant isolation vulnerability identified by Marcus. Prevents cross-tenant telemetry exposure.',
      severity: 'urgent',
      impactScore: 98,
      estimatedDays: 3,
      suggestedAction: 'Inject authenticated tenant_id into ReAct tool context parameters before AST schema execution.',
      relatedCategory: 'AI Superagent',
      githubIssueTemplate: {
        title: 'feat(superagent): enforce tenant context guard in tool execution runtime',
        body: 'Ensure every subagent tool call validates JWT session claims before querying MongoDB collections.',
        labels: ['security', 'superagent', 'enterprise'],
      },
    },
    {
      id: 'act-03',
      title: '1-Click Linear & Jira Feedback Synchronization Bridge',
      rationale: 'Requested in Discord with 28 upvotes. Accelerates customer feedback directly to engineering sprints.',
      severity: 'medium',
      impactScore: 78,
      estimatedDays: 4,
      suggestedAction: 'Add OAuth2 Linear app token exchange in settings panel with automated webhook listener.',
      relatedCategory: 'UI / UX Design',
      githubIssueTemplate: {
        title: 'feat(integrations): linear ticket automated bi-directional sync',
        body: 'Sync triaged high-severity feedback items into Linear team board automatically.',
        labels: ['feature', 'integrations'],
      },
    },
  ],
  modelMetadata: {
    model: 'Base44-Superagent-Synth-v1',
    promptTokens: 1842,
    completionTokens: 640,
    latencyMs: 820,
    scratchpadIterations: 1,
    schemaValid: true,
  },
};

/**
 * Corrupted spec used to showcase the Scratchpad Self-Healing Reflection loop live!
 */
export const CORRUPTED_DASHBOARD_SPEC_EXAMPLE = {
  version: '2.5.0-declarative',
  generatedAt: new Date().toISOString(),
  summary: {
    headline: 'Corrupted Spec with Hallucinated Types',
    keyTakeaway: 'Notice how the model output violated Zod schema bounds.',
    criticalAlertsCount: 3,
    overallSentimentScore: 142.5, // VIOLATION: > 100
    statusHealth: 'unstable', // VIOLATION: not 'healthy' | 'warning' | 'critical'
  },
  kpis: [
    {
      id: 'kpi-corrupted',
      title: 'Broken Metric Card',
      value: 'ERROR',
      changePercent: 0,
      trend: 'flat', // VIOLATION: not 'up' | 'down' | 'neutral'
      color: 'hyper-neon', // VIOLATION: not 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose'
      subtitle: 'Hallucinated color',
      icon: 'Unknown',
    }
  ], // VIOLATION: array min(2) required!
  sentimentMomentum: [
    { date: 'Mon', positive: -5, neutral: 10, negative: 90, nps: -85 } // VIOLATION: positive < 0
  ],
  featurePaybackCdf: {
    targetWeeks: -2, // VIOLATION: min(1)
    medianWeeks: 0,
    featureName: 'Broken CDF',
    curve: [
      { weeks: 1, probability: 1.48, featureName: 'Over 100%', expectedRetentionBoost: 10 } // VIOLATION: probability > 1.0!
    ]
  },
  categoryBreakdown: [
    { category: 'AI', bugCount: 1, featureRequestCount: 1, urgentCount: 0 }
  ],
  actionItems: [], // VIOLATION: min(1) required
  modelMetadata: {
    model: 'Raw-LLM-Without-Reflection',
    promptTokens: 1200,
    completionTokens: 300,
    latencyMs: 410,
    scratchpadIterations: 0,
    schemaValid: false,
  }
};
