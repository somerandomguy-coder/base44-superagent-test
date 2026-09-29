export type AgentStage = 
  | 'INGESTING' 
  | 'TRIAGING' 
  | 'BATCH_BUFFER' 
  | 'SYNTHESIZING' 
  | 'VALIDATING' 
  | 'LIVE_DEPLOY';

export interface StageDefinition {
  id: AgentStage;
  label: string;
  shortDesc: string;
  description: string;
  subagentName: string;
  iconName: string;
}

export interface ReActLogEntry {
  id: string;
  timestamp: string;
  stage: AgentStage;
  type: 'thought' | 'action' | 'observation' | 'error' | 'reflection' | 'deploy';
  message: string;
  toolCall?: {
    name: string;
    params?: Record<string, unknown>;
    result?: unknown;
  };
  durationMs?: number;
}

export interface ReflectionDiagnostic {
  iteration: number;
  hasErrors: boolean;
  errors: Array<{
    path: string;
    message: string;
    expected: string;
    received: string;
  }>;
  originalPayloadSnippet: string;
  repairedPayloadSnippet: string;
  reflectionPrompt: string;
  reflectionResolved: boolean;
}

export interface StateMachineContext {
  currentStage: AgentStage;
  status: 'idle' | 'running' | 'paused' | 'error' | 'success';
  activeItemsCount: number;
  batchId: string;
  startTime: number | null;
  endTime: number | null;
  logs: ReActLogEntry[];
  latestDiagnostic: ReflectionDiagnostic | null;
  autoHealEnabled: boolean;
  corruptedMode: boolean; // Simulates LLM schema hallucination to showcase self-healing
}
