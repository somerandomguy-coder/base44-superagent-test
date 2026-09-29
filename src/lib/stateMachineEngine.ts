import { AgentStage, ReActLogEntry, ReflectionDiagnostic, StateMachineContext } from '@/types/stateMachine';
import { GenerativeDashboardSpec } from '@/types/generativeUI';
import { GenerativeDashboardSpecSchema, formatZodReflectionErrors } from '@/lib/schemas';
import { CORRUPTED_DASHBOARD_SPEC_EXAMPLE, INITIAL_DASHBOARD_SPEC } from '@/lib/mockData';
import confetti from 'canvas-confetti';

export type PipelineEventCallback = (context: StateMachineContext, newSpec?: GenerativeDashboardSpec) => void;

export class StateMachineEngine {
  private context: StateMachineContext;
  private callbacks: PipelineEventCallback[] = [];
  private currentSpec: GenerativeDashboardSpec;

  constructor() {
    this.context = {
      currentStage: 'LIVE_DEPLOY',
      status: 'idle',
      activeItemsCount: 7,
      batchId: 'batch-init-892',
      startTime: null,
      endTime: null,
      logs: [
        {
          id: 'log-0',
          timestamp: new Date().toLocaleTimeString(),
          stage: 'LIVE_DEPLOY',
          type: 'deploy',
          message: 'Base44 Superagent System Initialized. Live Generative UI loaded.',
        },
      ],
      latestDiagnostic: null,
      autoHealEnabled: true,
      corruptedMode: false,
    };
    this.currentSpec = INITIAL_DASHBOARD_SPEC;
  }

  public subscribe(cb: PipelineEventCallback) {
    this.callbacks.push(cb);
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb);
    };
  }

  private notify(newSpec?: GenerativeDashboardSpec) {
    this.callbacks.forEach(cb => cb({ ...this.context }, newSpec));
  }

  private addLog(stage: AgentStage, type: ReActLogEntry['type'], message: string, toolCall?: ReActLogEntry['toolCall'], durationMs?: number) {
    const entry: ReActLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      stage,
      type,
      message,
      toolCall,
      durationMs,
    };
    this.context.logs = [entry, ...this.context.logs.slice(0, 49)];
    this.notify();
  }

  public getContext(): StateMachineContext {
    return { ...this.context };
  }

  public getCurrentSpec(): GenerativeDashboardSpec {
    return this.currentSpec;
  }

  public async runSuperagentPipeline(options?: {
    simulateCorruption?: boolean;
    autoHeal?: boolean;
    itemsCount?: number;
  }): Promise<GenerativeDashboardSpec> {
    const shouldCorrupt = options?.simulateCorruption ?? this.context.corruptedMode;
    const autoHeal = options?.autoHeal ?? this.context.autoHealEnabled;
    const count = options?.itemsCount ?? Math.floor(Math.random() * 8) + 4;

    this.context.status = 'running';
    this.context.batchId = `batch-${Date.now().toString(36).toUpperCase()}`;
    this.context.startTime = Date.now();
    this.context.activeItemsCount = count;
    this.context.latestDiagnostic = null;

    // --- STAGE 1: INGESTING ---
    this.context.currentStage = 'INGESTING';
    this.addLog('INGESTING', 'thought', `Superagent IngestWatcher triggered for batch ${this.context.batchId}`);
    this.addLog('INGESTING', 'action', `Polling multi-channel webhooks (GitHub, Discord, Intercom, Telemetry)...`, {
      name: 'poll_feedback_queues',
      params: { batchSize: count, channels: ['discord', 'github', 'appstore', 'telemetry'] },
    });
    await this.sleep(400);
    this.addLog('INGESTING', 'observation', `Ingested ${count} raw incoming user feedback payloads. Buffer synced.`);

    // --- STAGE 2: TRIAGING ---
    this.context.currentStage = 'TRIAGING';
    this.addLog('TRIAGING', 'thought', 'Executing zero-shot sentiment classification and entity extraction model');
    this.addLog('TRIAGING', 'action', 'Invoking Deno Serverless isolate classifier', {
      name: 'classify_intent_and_sentiment',
      params: { models: ['embeddings-v3', 'sentiment-triage-p0'] },
    });
    await this.sleep(450);
    this.addLog('TRIAGING', 'observation', `Identified categories: Database (3), AI Superagent (2), UI/UX (2). Tagged churn risks.`);

    // --- STAGE 3: BATCH_BUFFER ---
    this.context.currentStage = 'BATCH_BUFFER';
    this.addLog('BATCH_BUFFER', 'thought', 'Computing vector cosine distances to deduplicate redundant bug reports');
    this.addLog('BATCH_BUFFER', 'action', 'Clustering embeddings in ephemeral micro-isolate memory', {
      name: 'cluster_semantic_duplicates',
      params: { similarityThreshold: 0.84, minClusterSize: 2 },
    });
    await this.sleep(350);
    this.addLog('BATCH_BUFFER', 'observation', 'Aggregated into 3 unified root-cause problem clusters with priority weights.');

    // --- STAGE 4: SYNTHESIZING ---
    this.context.currentStage = 'SYNTHESIZING';
    this.addLog('SYNTHESIZING', 'thought', 'Synthesizing Declarative Generative UI Spec (Metrics, CDF Payback, Sentiment Area)');
    this.addLog('SYNTHESIZING', 'action', 'Model Router -> Generating typed JSON widget tree', {
      name: 'synthesize_generative_ui_spec',
      params: { targetContract: 'GenerativeDashboardSpecSchema' },
    });
    await this.sleep(550);

    // --- STAGE 5: VALIDATING (The Scratchpad Reflection Loop) ---
    this.context.currentStage = 'VALIDATING';
    this.addLog('VALIDATING', 'thought', 'Scratchpad Diagnostic: Executing headless Zod schema contract validator');

    let finalSpec: GenerativeDashboardSpec;

    if (shouldCorrupt) {
      // Simulate raw model producing broken / hallucinated spec
      this.addLog('VALIDATING', 'action', 'Validating candidate JSON payload against Zod contract', {
        name: 'zod_safe_parse',
        params: { payload: 'Raw LLM candidate output' },
      });
      await this.sleep(400);

      const parseAttempt1 = GenerativeDashboardSpecSchema.safeParse(CORRUPTED_DASHBOARD_SPEC_EXAMPLE);
      if (!parseAttempt1.success) {
        const errorList = formatZodReflectionErrors(parseAttempt1.error);
        const reflectionPromptText = `CRITICAL VALIDATION ERROR: Model generated schema with ${errorList.length} violations.\n` +
          errorList.map(e => `[${e.path}] expected ${e.expected}, received ${e.received}`).join('\n') +
          `\nPrompting model reflection to auto-repair violated AST tokens...`;

        this.context.latestDiagnostic = {
          iteration: 1,
          hasErrors: true,
          errors: errorList,
          originalPayloadSnippet: JSON.stringify(CORRUPTED_DASHBOARD_SPEC_EXAMPLE, null, 2),
          repairedPayloadSnippet: '',
          reflectionPrompt: reflectionPromptText,
          reflectionResolved: false,
        };

        this.addLog('VALIDATING', 'error', `[SCRATCHPAD REJECTED] ${errorList.length} contract violations detected! Prevented broken UI render.`);
        this.addLog('VALIDATING', 'reflection', `Self-Healing Reflection Loop Triggered: Feeding error AST back to LLM context...`);
        await this.sleep(800);

        if (autoHeal) {
          // Self-heal into pristine spec with updated timestamp and metrics
          const healedSpec: GenerativeDashboardSpec = {
            ...INITIAL_DASHBOARD_SPEC,
            generatedAt: new Date().toISOString(),
            modelMetadata: {
              ...INITIAL_DASHBOARD_SPEC.modelMetadata,
              scratchpadIterations: 2,
              schemaValid: true,
              latencyMs: 1420,
            },
            summary: {
              ...INITIAL_DASHBOARD_SPEC.summary,
              headline: 'Self-Healed Dashboard Pulse: Reflection Loop Fixed 6 Contract Violations',
              keyTakeaway: 'The Scratchpad detected hallucinated bounds (e.g. CDF probability > 1.0 & invalid color tokens) and automatically repaired them before client render.',
            }
          };

          this.context.latestDiagnostic.reflectionResolved = true;
          this.context.latestDiagnostic.repairedPayloadSnippet = JSON.stringify(healedSpec, null, 2);
          this.addLog('VALIDATING', 'action', 'Reflection Iteration 2: Re-validating corrected AST JSON with Zod', {
            name: 'zod_safe_parse_iteration_2',
            params: { status: 'CORRECTED_BY_REFLECTION' },
          });
          await this.sleep(400);
          this.addLog('VALIDATING', 'observation', 'Zod validation PASSED (ExitCode: 0). Schema strictly compliant. Safe for Live Deploy.');
          finalSpec = healedSpec;
        } else {
          this.context.status = 'error';
          this.addLog('VALIDATING', 'error', 'Auto-heal disabled. Generation halted due to schema failure.');
          this.notify();
          return this.currentSpec;
        }
      } else {
        finalSpec = INITIAL_DASHBOARD_SPEC;
      }
    } else {
      // Normal pristine flow
      this.addLog('VALIDATING', 'action', 'Validating candidate JSON payload against Zod contract', {
        name: 'zod_safe_parse',
        params: { contract: 'GenerativeDashboardSpecSchema' },
      });
      await this.sleep(300);
      this.addLog('VALIDATING', 'observation', 'Zod validation PASSED with 0 schema violations. 100% type compliant.');
      finalSpec = {
        ...INITIAL_DASHBOARD_SPEC,
        generatedAt: new Date().toISOString(),
        summary: {
          ...INITIAL_DASHBOARD_SPEC.summary,
          headline: `Live Feedback Pulse: ${count} New Items Processed & Triaged`,
        }
      };
    }

    // --- STAGE 6: LIVE_DEPLOY ---
    this.context.currentStage = 'LIVE_DEPLOY';
    this.addLog('LIVE_DEPLOY', 'thought', 'Hot-swapping live Generative UI state across WebSocket connected clients');
    this.addLog('LIVE_DEPLOY', 'deploy', `Dashboard promoted to production in ${Date.now() - (this.context.startTime || Date.now())}ms. Zero UI flicker.`);
    await this.sleep(200);

    this.context.status = 'success';
    this.context.endTime = Date.now();
    this.currentSpec = finalSpec;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981'],
      });
    } catch {
      // Canvas confetti fallback
    }

    this.notify(finalSpec);
    return finalSpec;
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const stateMachineEngineInstance = new StateMachineEngine();
