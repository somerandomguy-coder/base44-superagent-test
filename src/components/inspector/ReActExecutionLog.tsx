import React, { useState } from 'react';
import { 
  Terminal, 
  Brain, 
  Wrench, 
  Eye, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Trash2 
} from 'lucide-react';
import { ReActLogEntry } from '@/types/stateMachine';

interface ReActExecutionLogProps {
  logs: ReActLogEntry[];
}

export const ReActExecutionLog: React.FC<ReActExecutionLogProps> = ({ logs }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    const matchFilter = filter === 'all' || log.type === filter;
    const matchSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.stage.toLowerCase().includes(search.toLowerCase()) ||
      (log.toolCall?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchFilter && matchSearch;
  });

  const getLogTypeBadge = (type: ReActLogEntry['type']) => {
    switch (type) {
      case 'thought':
        return (
          <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-cyan-500/20">
            <Brain className="w-3 h-3" /> THOUGHT
          </span>
        );
      case 'action':
        return (
          <span className="flex items-center gap-1 text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-brand-500/20">
            <Wrench className="w-3 h-3" /> TOOL_CALL
          </span>
        );
      case 'observation':
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-emerald-500/20">
            <Eye className="w-3 h-3" /> OBSERVATION
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> ERROR
          </span>
        );
      case 'reflection':
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-amber-500/20">
            <Sparkles className="w-3 h-3" /> REFLECTION
          </span>
        );
      case 'deploy':
      default:
        return (
          <span className="flex items-center gap-1 text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded font-mono text-[10px] border border-violet-500/20">
            <CheckCircle2 className="w-3 h-3" /> LIVE_DEPLOY
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-4">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-400" />
          <h2 className="text-base font-bold text-white">
            ReAct Loop & Tool Execution Stream
          </h2>
          <span className="text-[11px] font-mono text-slate-400 bg-surface-50 px-2 py-0.5 rounded-md border border-slate-800">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-2.5 py-1 text-xs rounded-lg bg-surface-100 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-36 sm:w-44 font-mono"
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg text-xs bg-surface-100 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="all">All Types</option>
            <option value="thought">Thoughts</option>
            <option value="action">Tool Calls</option>
            <option value="observation">Observations</option>
            <option value="error">Errors</option>
            <option value="reflection">Reflections</option>
            <option value="deploy">Deploys</option>
          </select>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 rounded-xl bg-[#070A11] border border-slate-800/90 font-mono text-xs max-h-96 overflow-y-auto space-y-2.5 shadow-inner">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="p-2.5 rounded-lg bg-surface-200/50 border border-slate-800/60 hover:border-slate-700/80 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {getLogTypeBadge(log.type)}
                <span className="text-slate-500 font-mono">[{log.stage}]</span>
              </div>
              <span className="text-slate-500">{log.timestamp}</span>
            </div>

            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {log.message}
            </p>

            {log.toolCall && (
              <div className="mt-1.5 p-2 rounded bg-[#0A0E17] border border-slate-800/80 text-[11px] text-cyan-300">
                <span className="text-slate-500">tool:</span> <strong>{log.toolCall.name}</strong>
                {log.toolCall.params && (
                  <pre className="text-[10px] text-slate-400 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(log.toolCall.params, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No events match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
