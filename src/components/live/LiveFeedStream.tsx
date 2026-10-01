import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  AlertTriangle, 
  Heart, 
  Lightbulb, 
  MessageSquare, 
  Terminal, 
  Smartphone, 
  Activity, 
  Clock, 
  FileText, 
  Trash2 
} from 'lucide-react';
import { IngestedItem } from '@/lib/onTheFlyAnalyzer';

interface LiveFeedStreamProps {
  items: IngestedItem[];
  selectedTopicFilter: string | null;
  onClearItems: () => void;
}

export const LiveFeedStream: React.FC<LiveFeedStreamProps> = ({
  items,
  selectedTopicFilter,
  onClearItems,
}) => {
  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');

  const filteredItems = items.filter(item => {
    const matchSearch =
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.topics.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchTopic = selectedTopicFilter ? item.topics.includes(selectedTopicFilter) : true;
    const matchIntent = intentFilter === 'all' || item.intent === intentFilter;

    return matchSearch && matchTopic && matchIntent;
  });

  const getIntentBadge = (intent: IngestedItem['intent']) => {
    switch (intent) {
      case 'question':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            Question
          </span>
        );
      case 'bug':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Bug / Issue
          </span>
        );
      case 'praise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <Heart className="w-3 h-3 text-emerald-400 fill-current" />
            Praise
          </span>
        );
      case 'feature_request':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Feature Request
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <MessageSquare className="w-3 h-3" />
            General
          </span>
        );
    }
  };

  const getSourceIcon = (source: IngestedItem['source']) => {
    switch (source) {
      case 'curl':
        return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case 'discord':
        return <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />;
      case 'github':
        return (
          <svg className="w-3.5 h-3.5 fill-current text-slate-300" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case 'simulator':
        return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-brand-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Live Ingested Stream
            </h2>
            <span className="text-xs font-mono bg-surface-50 text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">
              {filteredItems.length} items
            </span>
            {selectedTopicFilter && (
              <span className="text-xs font-mono bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
                Filtered: #{selectedTopicFilter}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime feed of attendee comments, questions, and bug reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search stream..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-surface-100 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-36 sm:w-48"
            />
          </div>

          {/* Intent filter */}
          <select
            value={intentFilter}
            onChange={e => setIntentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-surface-100 border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Intents</option>
            <option value="question">Questions Only</option>
            <option value="bug">Bugs / Issues</option>
            <option value="praise">Praise</option>
            <option value="feature_request">Feature Requests</option>
          </select>

          {/* Reset / Clear */}
          <button
            onClick={onClearItems}
            title="Clear Stream"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              idx === 0
                ? 'bg-surface-100/95 border-brand-500/50 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                : 'bg-surface-200/70 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-surface-50 border border-slate-800">
                  {getSourceIcon(item.source)}
                </div>
                <span className="font-semibold text-xs text-white">
                  @{item.author}
                </span>
                <span className="text-[10px] text-slate-500 font-mono capitalize">
                  via {item.source}
                </span>
                {idx === 0 && (
                  <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse">
                    Just In
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {getIntentBadge(item.intent)}
                <span className="text-[11px] font-mono text-slate-500">
                  {item.timestamp}
                </span>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal my-2">
              {item.text}
            </p>

            {/* Bottom metadata tags */}
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {item.topics.map(topic => (
                  <span
                    key={topic}
                    className="text-[10px] font-mono text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-cyan-400" />
                  {item.wordCount} words
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.sentiment === 'positive'
                        ? 'bg-emerald-400'
                        : item.sentiment === 'negative'
                        ? 'bg-rose-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                  {item.sentimentScore}% sentiment
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No items in stream. Type a comment above or enable the Auto-Feed Simulator!
          </div>
        )}
      </div>
    </div>
  );
};
