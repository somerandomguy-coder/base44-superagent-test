import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  Activity, 
  BarChart2, 
  Zap, 
  Smile, 
  CheckCircle2 
} from 'lucide-react';
import { DynamicStats } from '@/lib/onTheFlyAnalyzer';

interface DynamicMetricsBarProps {
  stats: DynamicStats;
}

export const DynamicMetricsBar: React.FC<DynamicMetricsBarProps> = ({ stats }) => {
  return (
    <div className="space-y-4">
      {/* Dynamic AI Executive Summary Banner (Recalculated on the fly!) */}
      <div className="p-4 rounded-xl glass-card border border-brand-500/30 bg-gradient-to-r from-brand-900/20 via-surface-100/90 to-cyan-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/40 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold">
                Agent Synthesized on the fly
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                0ms Latency
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {stats.aiExecutiveSummary}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 text-xs font-mono self-end md:self-auto">
          <span className="text-slate-400">
            Sentiment: <strong className="text-emerald-400">{stats.avgSentimentScore}%</strong>
          </span>
        </div>
      </div>

      {/* 4 Core Dynamic Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ingested */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Ingested Live</span>
            <Activity className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stats.totalItems}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">items</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Stream status: <span className="text-emerald-400 font-bold">Realtime</span>
          </div>
        </div>

        {/* Word Count */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Word Footprint</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
              {stats.totalWords}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">words</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Average: <strong className="text-slate-200">~{stats.avgWordsPerItem}</strong> words/item
          </div>
        </div>

        {/* Primary Intent Breakdown */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Intent Ratio</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stats.intentCounts.question}
            </span>
            <span className="text-[11px] text-amber-400 font-mono">Questions</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className="text-rose-400">{stats.intentCounts.bug} bugs</span>
            <span>•</span>
            <span className="text-emerald-400">{stats.intentCounts.praise} praise</span>
          </div>
        </div>

        {/* Dynamic Sentiment Meter */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Net Sentiment</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {stats.avgSentimentScore}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono">positive</span>
          </div>
          {/* Sentiment Bar */}
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${stats.avgSentimentScore}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${100 - stats.avgSentimentScore}%` }}
              className="bg-rose-500/80 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
