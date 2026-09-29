import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Code2, 
  FileCheck2, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Terminal 
} from 'lucide-react';
import { StateMachineContext } from '@/types/stateMachine';

interface ScratchpadReflectionLabProps {
  context: StateMachineContext;
  onRunTestCorruption: () => void;
  onToggleAutoHeal: (enabled: boolean) => void;
}

export const ScratchpadReflectionLab: React.FC<ScratchpadReflectionLabProps> = ({
  context,
  onRunTestCorruption,
  onToggleAutoHeal,
}) => {
  const [activeTab, setActiveTab] = useState<'errors' | 'prompt_diff' | 'raw_candidate' | 'healed_spec'>('errors');
  const diagnostic = context.latestDiagnostic;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Scratchpad Diagnostic & Self-Healing Reflection Engine
            </h2>
            <span className="text-[10px] font-mono bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
              ReAct Loop Guard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Intercepts invalid AST or type violations pre-render, prompts model with error diff, and repairs schema autonomously.
          </p>
        </div>

        {/* Action toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer bg-surface-100 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={context.autoHealEnabled}
              onChange={e => onToggleAutoHeal(e.target.checked)}
              className="rounded bg-surface-200 border-slate-700 text-brand-500 focus:ring-brand-500"
            />
            <span>Auto-Healing Enabled</span>
          </label>

          <button
            onClick={onRunTestCorruption}
            disabled={context.status === 'running'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Schema Violation</span>
          </button>
        </div>
      </div>

      {/* State Banner */}
      {diagnostic ? (
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          diagnostic.hasErrors && diagnostic.reflectionResolved
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : diagnostic.hasErrors && !diagnostic.reflectionResolved
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-surface-100 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              diagnostic.reflectionResolved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}>
              {diagnostic.reflectionResolved ? (
                <Sparkles className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm">
                {diagnostic.reflectionResolved
                  ? `Self-Healing Success (Iteration ${diagnostic.iteration + 1})`
                  : `Scratchpad Intercepted ${diagnostic.errors.length} Schema Violations`}
              </div>
              <div className="text-xs opacity-85">
                {diagnostic.reflectionResolved
                  ? 'Zod detected contract mismatches in raw LLM output, prompted reflection diff, and repaired AST before Live Deploy.'
                  : 'Candidate JSON rejected by Zod runtime guard. Production preview protected from runtime crash.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-black/30 border border-current">
              Contract: GenerativeDashboardSpecSchema
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-surface-100/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">
                Scratchpad Guard Standing By
              </div>
              <div className="text-xs text-slate-400">
                Current live generative dashboard is 100% compliant with Zod runtime contracts.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Exit Code 0
          </span>
        </div>
      )}

      {/* Diagnostic Tabs */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-surface-200/90">
        <div className="flex items-center border-b border-slate-800 bg-surface-100/90 px-3 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-3 py-2 rounded-t-lg border-b-2 font-medium transition-all ${
              activeTab === 'errors'
                ? 'border-brand-500 text-brand-300 bg-surface-200'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Zod Violations {diagnostic?.errors.length ? `(${diagnostic.errors.length})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('prompt_diff')}
            className={`px-3 py-2 rounded-t-lg border-b-2 font-medium transition-all ${
              activeTab === 'prompt_diff'
                ? 'border-brand-500 text-brand-300 bg-surface-200'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Reflection Prompt Diff
          </button>

          <button
            onClick={() => setActiveTab('raw_candidate')}
            className={`px-3 py-2 rounded-t-lg border-b-2 font-medium transition-all ${
              activeTab === 'raw_candidate'
                ? 'border-brand-500 text-brand-300 bg-surface-200'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidate AST JSON
          </button>

          <button
            onClick={() => setActiveTab('healed_spec')}
            className={`px-3 py-2 rounded-t-lg border-b-2 font-medium transition-all ${
              activeTab === 'healed_spec'
                ? 'border-brand-500 text-brand-300 bg-surface-200'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Healed Payload
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs">
          {activeTab === 'errors' && (
            <div className="space-y-2">
              {diagnostic?.errors && diagnostic.errors.length > 0 ? (
                diagnostic.errors.map((err, i) => (
                  <div key={i} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Path: {err.path}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Zod Violation #{i + 1}
                      </span>
                    </div>
                    <div className="text-slate-300">Issue: {err.message}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Expected: <code className="text-emerald-400">{err.expected}</code></span>
                      <span>Received: <code className="text-rose-400">{err.received}</code></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  No schema violations detected. Spec passed all Zod constraints.
                </div>
              )}
            </div>
          )}

          {activeTab === 'prompt_diff' && (
            <div className="space-y-3">
              <div className="text-slate-400 text-[11px]">
                // Reflection payload automatically injected back into the LLM system prompt context
              </div>
              <pre className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 text-brand-300 whitespace-pre-wrap leading-relaxed">
                {diagnostic?.reflectionPrompt || '// Click "Simulate Schema Violation" above to generate a live reflection prompt diff.'}
              </pre>
            </div>
          )}

          {activeTab === 'raw_candidate' && (
            <pre className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 text-amber-300 whitespace-pre-wrap leading-relaxed">
              {diagnostic?.originalPayloadSnippet || '// Candidate JSON payload rendered here.'}
            </pre>
          )}

          {activeTab === 'healed_spec' && (
            <pre className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
              {diagnostic?.repairedPayloadSnippet || '// Healed & validated JSON spec promoted to Live Deploy.'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
