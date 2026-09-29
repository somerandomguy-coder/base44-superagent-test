import React, { useState } from 'react';
import { PlusCircle, Sparkles, Send, MessageSquare } from 'lucide-react';
import { FeedbackItem, FeedbackSource, FeedbackSentiment, FeedbackCategory } from '@/types/feedback';

interface NewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: FeedbackItem) => void;
}

export const NewFeedbackModal: React.FC<NewFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState<FeedbackSource>('discord');
  const [sentiment, setSentiment] = useState<FeedbackSentiment>('neutral');
  const [category, setCategory] = useState<FeedbackCategory>('ai_superagent');
  const [tagsString, setTagsString] = useState('superagent, base44, triage');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: {
    source: FeedbackSource;
    author: string;
    content: string;
    sentiment: FeedbackSentiment;
    category: FeedbackCategory;
    tags: string;
  }) => {
    setSource(preset.source);
    setAuthor(preset.author);
    setContent(preset.content);
    setSentiment(preset.sentiment);
    setCategory(preset.category);
    setTagsString(preset.tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    const newItem: FeedbackItem = {
      id: `fb-${Date.now().toString(36)}`,
      source,
      author: author.startsWith('@') ? author.slice(1) : author,
      content,
      sentiment,
      sentimentScore: sentiment === 'positive' ? 0.95 : sentiment === 'critical' ? 0.05 : sentiment === 'negative' ? 0.25 : 0.6,
      category,
      severity: sentiment === 'critical' ? 'urgent' : sentiment === 'negative' ? 'high' : 'low',
      timestamp: 'Just now',
      tags: tagsString.split(',').map(t => t.trim()).filter(Boolean),
      triaged: true,
      churnRisk: sentiment === 'critical' || sentiment === 'negative',
      metadata: {
        os: 'Web Client',
        version: 'v2.5.0',
      }
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl glass-panel-glow bg-[#0D111C] border border-slate-700/80 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              Ingest Custom Feedback
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base font-bold px-2 py-0.5 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Quick Meetup Presets:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleApplyPreset({
                source: 'github',
                author: 'meetup_attendee',
                content: 'Deno serverless cold start dropped 3 WebSocket packets during live demo!',
                sentiment: 'critical',
                category: 'performance',
                tags: 'deno, websockets, latency',
              })}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-800 text-left text-slate-300 hover:border-brand-500/40 text-[11px]"
            >
              ⚠️ <strong className="text-white">Cold-start Drop</strong> (Critical)
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset({
                source: 'discord',
                author: 'happy_builder',
                content: 'Base44 Superagent generated our entire landing page in 30 seconds! Incredible UX.',
                sentiment: 'positive',
                category: 'ai_superagent',
                tags: 'superagent, delight, love',
              })}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-800 text-left text-slate-300 hover:border-brand-500/40 text-[11px]"
            >
              ✨ <strong className="text-white">AI Delight</strong> (Positive)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Channel Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as FeedbackSource)}
                className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200"
              >
                <option value="discord">Discord Community</option>
                <option value="github">GitHub Issue</option>
                <option value="base44_telemetry">Base44 Telemetry</option>
                <option value="intercom">Intercom Support</option>
                <option value="appstore">App Store</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-mono">Author Username</label>
              <input
                type="text"
                required
                placeholder="e.g. dev_sarah"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Feedback Content</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the bug, praise, or feature request..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-mono">Initial Sentiment</label>
              <select
                value={sentiment}
                onChange={e => setSentiment(e.target.value as FeedbackSentiment)}
                className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200"
              >
                <option value="positive">Positive (+NPS)</option>
                <option value="neutral">Neutral (Query)</option>
                <option value="negative">Negative (Bug)</option>
                <option value="critical">Critical (Churn Risk)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-mono">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FeedbackCategory)}
                className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200"
              >
                <option value="ai_superagent">AI Superagent</option>
                <option value="database">Database & RLS</option>
                <option value="performance">Performance & Cold Starts</option>
                <option value="ui_ux">UI / UX Design</option>
                <option value="auth">Auth & Session</option>
                <option value="feature_request">Feature Request</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono">Comma-Separated Tags</label>
            <input
              type="text"
              value={tagsString}
              onChange={e => setTagsString(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-surface-100 border border-slate-700 text-slate-200 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ingest & Run Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
