import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Terminal, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Radio, 
  PlusCircle, 
  MessageSquare, 
  HelpCircle, 
  AlertTriangle, 
  Heart, 
  Lightbulb 
} from 'lucide-react';

interface LiveFeedHeaderProps {
  onSendFeedback: (text: string, author?: string) => void;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
  sseConnected: boolean;
}

const PRESETS = [
  { label: '❓ Question: Cold Start', text: 'How does Base44 keep Deno serverless cold starts under 5ms?' },
  { label: '⚠️ Bug: Mongo Pool Timeout', text: 'MongoDB connection pool timeouts observed when concurrency spikes over 50 req/s.' },
  { label: '💖 Praise: Superagent', text: 'The Superagent feature generated my entire feedback dashboard in 20 seconds. Incredible!' },
  { label: '💡 Feature: Linear Sync', text: 'Please add 1-click bi-directional sync to Linear and Jira team boards.' },
];

export const LiveFeedHeader: React.FC<LiveFeedHeaderProps> = ({
  onSendFeedback,
  isSimulatorActive,
  onToggleSimulator,
  sseConnected,
}) => {
  const [inputText, setInputText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showCurlModal, setShowCurlModal] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendFeedback(inputText.trim(), authorName.trim() || undefined);
    setInputText('');
  };

  const handleApplyPreset = (presetText: string) => {
    onSendFeedback(presetText, 'meetup_guest');
  };

  const curlCommand = `curl -X POST http://${window.location.hostname}:5173/api/feedback \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Does Base44 support WebSocket connection pooling in Deno?", "author": "@meetup_guest"}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="glass-panel-glow rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-r from-surface-100/90 via-surface-200/90 to-surface-100/90 space-y-4">
      {/* Top row: Status indicators & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sseConnected ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${sseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-xs font-mono font-semibold text-slate-200">
              Mock Server: <span className="text-emerald-400 font-bold">Active</span>
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            POST /api/feedback
          </span>
        </div>

        {/* Simulator & cURL Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSimulatorActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/10 animate-pulse'
                : 'bg-surface-50 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            {isSimulatorActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Auto-Feed Simulator: {isSimulatorActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowCurlModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-surface-50 hover:bg-surface-100 text-brand-300 border border-brand-500/30 transition-all hover:border-brand-500/50"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>cURL Endpoint</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="sm:w-36">
          <input
            type="text"
            placeholder="@author (optional)"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl bg-surface-200 border border-slate-700 text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex-1 relative">
          <input
            type="text"
            required
            placeholder="Type any comment, product question, or bug report to ingest live..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-surface-200 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ingest Live</span>
        </button>
      </form>

      {/* Quick Meetup Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          Quick Feed Presets:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplyPreset(preset.text)}
            className="px-2.5 py-1 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-800 hover:border-brand-500/40 text-slate-300 hover:text-white transition-all text-[11px]"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* cURL Modal */}
      {showCurlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl glass-panel-glow bg-[#0D111C] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">
                  Feed Into Live Screen via cURL / HTTP
                </h3>
              </div>
              <button
                onClick={() => setShowCurlModal(false)}
                className="text-slate-400 hover:text-white font-bold text-base px-2 py-0.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anyone on the same Wi-Fi can run this cURL command from their terminal. The message will appear live on your screen in real time, and the agent will immediately re-index topics and recalculate statistics!
            </p>

            <div className="p-3.5 rounded-xl bg-[#070A11] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{curlCommand}</pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCurlModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyCurl}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy cURL Command</span>
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
