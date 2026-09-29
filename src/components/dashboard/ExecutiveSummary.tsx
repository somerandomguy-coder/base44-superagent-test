import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Clock, Layers, Zap } from 'lucide-react';
import { GenerativeDashboardSpec } from '@/types/generativeUI';

interface ExecutiveSummaryProps {
  spec: GenerativeDashboardSpec;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ spec }) => {
  const { summary, modelMetadata } = spec;

  const getStatusBadge = () => {
    switch (summary.statusHealth) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            System Healthy
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Attention Required
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical Escalation
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 glass-panel-glow bg-gradient-to-r from-surface-100/90 via-surface-200/80 to-surface-100/90">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {getStatusBadge()}
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-surface-50 px-2.5 py-0.5 rounded-md border border-slate-800">
              <Sparkles className="w-3 h-3 text-brand-400" />
              Generated via {modelMetadata.model}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              v{spec.version}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {summary.headline}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {summary.keyTakeaway}
          </p>

          {/* Model metadata pills */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Synthesis Latency: <strong className="text-slate-200">{modelMetadata.latencyMs}ms</strong>
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              Scratchpad Iterations: <strong className="text-slate-200">{modelMetadata.scratchpadIterations}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Token Footprint: <strong className="text-slate-200">{modelMetadata.promptTokens + modelMetadata.completionTokens} tokens</strong>
            </span>
          </div>
        </div>

        {/* Sentiment Score Gauge */}
        <div className="flex items-center gap-4 bg-surface-200/90 border border-slate-800/80 p-4 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {summary.overallSentimentScore.toFixed(1)}%
            </div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Sentiment Index
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-800" />

          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight text-rose-400">
              {summary.criticalAlertsCount}
            </div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Critical Signals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
