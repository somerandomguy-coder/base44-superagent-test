import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Smartphone, 
  Headphones, 
  Activity, 
  AlertTriangle, 
  ThumbsUp, 
  Flame, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { FeedbackItem, FeedbackSource, FeedbackSentiment } from '@/types/feedback';

interface FeedbackFeedTableProps {
  items: FeedbackItem[];
}

export const FeedbackFeedTable: React.FC<FeedbackFeedTableProps> = ({ items }) => {
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<FeedbackItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = 
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.author.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchChannel = selectedChannel === 'all' || item.source === selectedChannel;
      const matchSentiment = 
        selectedSentiment === 'all' 
          ? true 
          : selectedSentiment === 'churn' 
          ? item.churnRisk 
          : item.sentiment === selectedSentiment;

      return matchSearch && matchChannel && matchSentiment;
    });
  }, [items, search, selectedChannel, selectedSentiment]);

  const getSourceIcon = (source: FeedbackSource) => {
    switch (source) {
      case 'github':
        return (
          <svg className="w-3.5 h-3.5 fill-current text-slate-300" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case 'discord':
        return <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />;
      case 'appstore':
        return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'intercom':
        return <Headphones className="w-3.5 h-3.5 text-blue-400" />;
      case 'base44_telemetry':
      default:
        return <Activity className="w-3.5 h-3.5 text-brand-400" />;
    }
  };

  const getSentimentPill = (sentiment: FeedbackSentiment, score: number) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Positive ({(score * 100).toFixed(0)}%)
          </span>
        );
      case 'neutral':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Neutral ({(score * 100).toFixed(0)}%)
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Negative ({(score * 100).toFixed(0)}%)
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
            <Flame className="w-2.5 h-2.5 fill-current" />
            Critical ({(score * 100).toFixed(0)}%)
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Multi-Channel Ingest Stream
            </h2>
            <span className="text-[11px] font-mono bg-surface-50 text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">
              {filteredItems.length} items
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Unified telemetry ingested and pre-triaged by Deno Serverless Edge subagents
          </p>
        </div>

        {/* Filter controls bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search author, tag, keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-surface-100 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-48 sm:w-56"
            />
          </div>

          {/* Channel dropdown */}
          <select
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-surface-100 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Channels</option>
            <option value="github">GitHub Issues</option>
            <option value="discord">Discord Community</option>
            <option value="base44_telemetry">Base44 Telemetry</option>
            <option value="intercom">Intercom Support</option>
            <option value="appstore">App Store</option>
          </select>

          {/* Sentiment dropdown */}
          <select
            value={selectedSentiment}
            onChange={e => setSelectedSentiment(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-surface-100 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Sentiments</option>
            <option value="churn">⚠️ Churn Risk Only</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Stream Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-200/90 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Channel / Author</th>
              <th className="py-3 px-4">Raw Feedback & Context</th>
              <th className="py-3 px-4">AI Sentiment</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredItems.map(item => (
              <tr
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="hover:bg-surface-100/70 transition-colors cursor-pointer group"
              >
                {/* Source & Author */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-surface-50 border border-slate-800">
                      {getSourceIcon(item.source)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-brand-300 transition-colors">
                        @{item.author}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono capitalize">
                        {item.source.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Content & Tags */}
                <td className="py-3 px-4 max-w-md">
                  <p className="line-clamp-2 text-slate-300 leading-relaxed font-normal">
                    {item.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-slate-400 bg-surface-50 px-1.5 py-0.5 rounded border border-slate-800/60">
                        #{tag}
                      </span>
                    ))}
                    {item.churnRisk && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Churn Alert
                      </span>
                    )}
                  </div>
                </td>

                {/* Sentiment */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {getSentimentPill(item.sentiment, item.sentimentScore)}
                </td>

                {/* Category */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-mono text-xs text-brand-300">
                    {item.category}
                  </span>
                </td>

                {/* Severity */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.severity === 'urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : item.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.severity}
                  </span>
                </td>

                {/* Timestamp */}
                <td className="py-3 px-4 whitespace-nowrap text-right font-mono text-slate-500 text-[11px]">
                  {item.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl glass-panel-glow bg-[#0D111C] border border-slate-700/80 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-surface-50 border border-slate-700">
                  {getSourceIcon(activeItem.source)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Feedback #{activeItem.id} by @{activeItem.author}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Channel: {activeItem.source} | {activeItem.timestamp}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-white text-base font-bold px-2 py-0.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-100 border border-slate-800 text-slate-200 text-xs leading-relaxed">
              "{activeItem.content}"
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-50 border border-slate-800">
                <span className="text-slate-400 block mb-1">AI Classification</span>
                <div className="font-mono text-slate-200">Category: <span className="text-brand-300">{activeItem.category}</span></div>
                <div className="font-mono text-slate-200">Severity: <span className="text-amber-400">{activeItem.severity}</span></div>
                <div className="font-mono text-slate-200">Triaged: <span className="text-emerald-400">Yes (Deno Edge)</span></div>
              </div>

              <div className="p-3 rounded-lg bg-surface-50 border border-slate-800">
                <span className="text-slate-400 block mb-1">Telemetry Context</span>
                {activeItem.metadata ? (
                  <div className="space-y-0.5 font-mono text-[11px] text-slate-300">
                    {activeItem.metadata.os && <div>OS: {activeItem.metadata.os}</div>}
                    {activeItem.metadata.browser && <div>Browser: {activeItem.metadata.browser}</div>}
                    {activeItem.metadata.version && <div>App Version: {activeItem.metadata.version}</div>}
                    {activeItem.metadata.upvotes !== undefined && (
                      <div className="flex items-center gap-1 text-cyan-400">
                        <ThumbsUp className="w-3 h-3" /> {activeItem.metadata.upvotes} community upvotes
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 font-mono">No telemetry attached</div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
