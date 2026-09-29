import React, { useState } from 'react';
import { 
  GitPullRequest, 
  ExternalLink, 
  Clock, 
  Flame, 
  Check, 
  Copy, 
  Sparkles, 
  FileCode2 
} from 'lucide-react';
import { ActionItemSpec } from '@/types/generativeUI';

interface ActionItemsPanelProps {
  actionItems: ActionItemSpec[];
}

export const ActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ actionItems }) => {
  const [selectedTicket, setSelectedTicket] = useState<ActionItemSpec | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTicket = (item: ActionItemSpec) => {
    const text = `# ${item.githubIssueTemplate?.title || item.title}\n\n${item.githubIssueTemplate?.body || item.rationale}\n\n**Suggested Solution:**\n${item.suggestedAction}\n\n**Impact Score:** ${item.impactScore}/100 | **Effort:** ~${item.estimatedDays} days`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (severity: ActionItemSpec['severity']) => {
    switch (severity) {
      case 'urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'low':
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Prioritized Superagent Action Items
            </h2>
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/20">
              Autonomous Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by customer churn impact vs engineering complexity
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {actionItems.length} High-Yield Engineering Targets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionItems.map(item => (
          <div
            key={item.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-surface-100/90 border border-slate-800/90 hover:border-brand-500/40 transition-all duration-200 group"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                  {item.severity}
                </span>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1 text-emerald-400" title="Impact on NPS / Retention">
                    <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                    {item.impactScore}/100
                  </span>
                  <span className="flex items-center gap-1 text-slate-400" title="Estimated Days to Resolve">
                    <Clock className="w-3 h-3" />
                    ~{item.estimatedDays}d
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="text-[11px] font-mono text-brand-400 uppercase tracking-wide mb-1">
                {item.relatedCategory}
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                {item.rationale}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-mono line-clamp-2 mb-3">
                <strong className="text-slate-300">Fix:</strong> {item.suggestedAction}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTicket(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-50 hover:bg-surface-200 text-slate-200 border border-slate-700/70 hover:border-slate-600 transition-colors"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect Ticket</span>
                </button>

                <button
                  onClick={() => handleCopyTicket(item)}
                  title="Copy GitHub / Linear Issue markdown"
                  className="p-1.5 rounded-lg bg-surface-50 hover:bg-brand-500/20 text-slate-400 hover:text-brand-300 border border-slate-700/70 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl glass-panel-glow bg-[#0D111C] border border-slate-700/80 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">
                  Automated Issue & Linear Spec Generator
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono">Title</label>
                <input
                  type="text"
                  readOnly
                  value={selectedTicket.githubIssueTemplate?.title || selectedTicket.title}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-surface-100 border border-slate-700 font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono">Suggested Labels</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedTicket.githubIssueTemplate?.labels || ['feedback', 'superagent']).map(label => (
                    <span key={label} className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 font-mono text-[11px]">
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono">Issue Body (Markdown)</label>
                <textarea
                  readOnly
                  rows={7}
                  value={selectedTicket.githubIssueTemplate?.body || selectedTicket.rationale}
                  className="w-full mt-1 p-3 rounded-lg bg-surface-100 border border-slate-700 font-mono text-slate-300 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleCopyTicket(selectedTicket)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all"
              >
                {copiedId === selectedTicket.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
