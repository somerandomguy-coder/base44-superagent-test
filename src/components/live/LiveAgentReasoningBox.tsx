import React from 'react';
import { Terminal, Brain, Sparkles, Filter, Hash } from 'lucide-react';
import { DynamicStats, IngestedItem } from '@/lib/onTheFlyAnalyzer';

interface LiveAgentReasoningBoxProps {
  stats: DynamicStats;
  latestItem: IngestedItem | null;
  agentLogs: string[];
  selectedTopicFilter: string | null;
  onSelectTopicFilter: (topic: string | null) => void;
}

export const LiveAgentReasoningBox: React.FC<LiveAgentReasoningBoxProps> = ({
  stats,
  latestItem,
  agentLogs,
  selectedTopicFilter,
  onSelectTopicFilter,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Dynamic Topic Cloud (Clickable filters) */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white">
              Dynamic Topic Cloud
            </h3>
          </div>
          {selectedTopicFilter && (
            <button
              onClick={() => onSelectTopicFilter(null)}
              className="text-[10px] font-mono text-cyan-400 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          Click any extracted topic to filter the live stream:
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {stats.topTopics.map(({ topic, count }) => {
            const isSelected = selectedTopicFilter === topic;
            return (
              <button
                key={topic}
                onClick={() => onSelectTopicFilter(isSelected ? null : topic)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white font-bold ring-2 ring-brand-400'
                    : 'bg-surface-100 hover:bg-surface-50 text-slate-300 hover:text-white border border-slate-800 hover:border-brand-500/40'
                }`}
              >
                <span>#{topic}</span>
                <span className="text-[10px] opacity-75 font-sans bg-black/30 px-1.5 py-0.2 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
          {stats.topTopics.length === 0 && (
            <div className="text-xs text-slate-500 font-mono py-2">
              No topics extracted yet...
            </div>
          )}
        </div>
      </div>

      {/* Right: Agent Under The Hood Live Thinking Stream */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">
              Agent Under The Hood: On-The-Fly Ingestion Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Deno Isolate Sim
          </span>
        </div>

        {/* Terminal logs */}
        <div className="h-36 p-3 rounded-xl bg-[#070A11] border border-slate-800/90 font-mono text-xs overflow-y-auto space-y-1.5 shadow-inner">
          {agentLogs.slice(0, 10).map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
              <span className="text-slate-600 select-none">›</span>
              <span className={idx === 0 ? 'text-brand-300 font-medium' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
          {agentLogs.length === 0 && (
            <div className="text-slate-500">Awaiting first incoming payload...</div>
          )}
        </div>
      </div>
    </div>
  );
};
