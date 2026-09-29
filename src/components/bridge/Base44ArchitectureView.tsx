import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  Server, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { 
  BASE44_DENO_INGEST_FUNCTION, 
  BASE44_DENO_SUPERAGENT_FUNCTION, 
  BASE44_MONGODB_SCHEMA 
} from '@/lib/base44Templates';

export const Base44ArchitectureView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'ingest' | 'superagent' | 'mongodb'>('ingest');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const getCodeContent = () => {
    switch (activeCodeTab) {
      case 'ingest':
        return BASE44_DENO_INGEST_FUNCTION;
      case 'superagent':
        return BASE44_DENO_SUPERAGENT_FUNCTION;
      case 'mongodb':
      default:
        return BASE44_MONGODB_SCHEMA;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopiedTab(activeCodeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Architecture Card */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-slate-800/80 bg-gradient-to-br from-surface-100/90 via-surface-200/90 to-surface-100/90">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30">
            <Cpu className="w-3.5 h-3.5" />
            Base44 Systems Architecture Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Base44, Lovable, & Bolt.new Work Under the Hood
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The foundation of modern AI app builders is not magic—it is an established systems-engineering blueprint combining <strong>deterministic state machines</strong>, <strong>Deno V8 micro-isolates</strong>, <strong>typed AST contracts</strong>, and <strong>self-healing scratchpad loops</strong>.
          </p>
        </div>

        {/* 5-Layer System Architecture Diagram */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-surface-200/80 border border-brand-500/30 space-y-2">
            <span className="font-mono text-[10px] text-brand-400 font-bold uppercase tracking-wider block">
              Layer 1
            </span>
            <div className="font-bold text-xs text-white">Typed Contracts</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              BAML / Zod schemas defining rigid input/output structures for LLMs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/80 border border-cyan-500/30 space-y-2">
            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              Layer 2
            </span>
            <div className="font-bold text-xs text-white">Deterministic States</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              State machine controlling step transitions (Ingest ➔ Triage ➔ Deploy).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/80 border border-slate-700 space-y-2">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Layer 3
            </span>
            <div className="font-bold text-xs text-white">Rigid Scaffold</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Vite + Tailwind + shadcn/ui. Flat file structure avoids black-box abstractions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/80 border border-emerald-500/30 space-y-2">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Layer 4
            </span>
            <div className="font-bold text-xs text-white">Deno Isolates</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Ephemeral V8 runtimes booting in &lt;5ms with zero Docker VM overhead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/80 border border-violet-500/30 space-y-2">
            <span className="font-mono text-[10px] text-violet-400 font-bold uppercase tracking-wider block">
              Layer 5
            </span>
            <div className="font-bold text-xs text-white">Self-Healing Loop</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Scratchpad captures AST/type errors and prompts reflection retry before deploy.
            </p>
          </div>
        </div>
      </div>

      {/* Code Export Bridge Tabs */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-base font-bold text-white">
                Base44 Production Code Bridge
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Copy-pasteable Deno TypeScript Edge Functions and MongoDB Entity models ready for Base44
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all active:scale-95"
          >
            {copiedTab === activeCodeTab ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied Code to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Current File</span>
              </>
            )}
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveCodeTab('ingest')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeCodeTab === 'ingest'
                ? 'bg-surface-50 text-brand-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>functions/feedback_ingest.ts</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('superagent')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeCodeTab === 'superagent'
                ? 'bg-surface-50 text-brand-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>functions/triage_superagent.ts</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('mongodb')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeCodeTab === 'mongodb'
                ? 'bg-surface-50 text-brand-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>entities/FeedbackEntities.json (RLS)</span>
          </button>
        </div>

        {/* Code Block with syntax aesthetic */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070A11] p-4">
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
            {getCodeContent()}
          </pre>
        </div>
      </div>

      {/* Meetup Presentation Cheatsheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-surface-100/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            Why Base44 Uses Deno Micro-Isolates
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike Docker containers that take seconds to boot and consume hundreds of megabytes of RAM, V8 isolates boot in under <strong>5 milliseconds</strong>. This allows Base44 to spin up a fresh, sandboxed runtime for every single Superagent tool call without latency bottlenecks.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-surface-100/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            Why Declarative Generative UI Beats Raw JSX
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instructing an LLM to generate raw TypeScript/JSX files often causes broken React imports, syntax hallucinations, and CSS layout crashes. Generating typed JSON specifications that hydrate robust pre-built Recharts and Tailwind widgets guarantees <strong>100% runtime stability</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
