import React, { useState, useEffect, useRef } from 'react';
import { 
  IngestedItem, 
  DynamicStats, 
  analyzeItemOnTheFly, 
  computeStatsOnTheFly, 
  INITIAL_LIVE_SEED 
} from '@/lib/onTheFlyAnalyzer';
import { 
  Sparkles, 
  Send, 
  ThumbsUp, 
  HelpCircle, 
  AlertTriangle, 
  Heart, 
  Lightbulb, 
  MessageSquare, 
  Activity, 
  Terminal, 
  Play, 
  Pause, 
  Check, 
  Copy, 
  Hash, 
  BarChart2, 
  Flame 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import confetti from 'canvas-confetti';

const TOPIC_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#A78BFA', '#38BDF8'];

const DEMO_PRESETS = [
  { label: '❓ How fast is Deno cold start?', text: 'How does Base44 keep Deno serverless cold starts under 5ms?' },
  { label: '⚠️ MongoDB timeout at 50 req/s', text: 'MongoDB connection pool timeouts observed when concurrency spikes over 50 req/s.' },
  { label: '💖 Superagent built app in 30s', text: 'The Superagent feature generated my entire feedback dashboard in 30 seconds. Incredible!' },
  { label: '💡 Add 1-click Linear sync', text: 'Please add 1-click bi-directional sync to Linear and Jira team boards.' },
];

const SIMULATOR_POOL = [
  { text: 'Does Base44 support WebSocket subprotocols in Deno serverless functions?', author: 'concurrency_guru' },
  { text: 'Can we configure custom Row-Level Security policies per user team in MongoDB?', author: 'security_lead' },
  { text: 'Superagent triaged 40 customer bug reports in under a minute. Huge productivity win!', author: 'founder_sam' },
  { text: 'Is there a native webhook to trigger Deno functions from GitHub PR events?', author: 'dev_alex' },
  { text: 'The dark mode dashboard and custom Recharts look super slick!', author: 'designer_dan' },
];

export function App() {
  const [items, setItems] = useState<IngestedItem[]>(() => {
    return [
      analyzeItemOnTheFly({
        text: 'How does Base44 keep Deno serverless cold starts under 5ms?',
        author: 'alex_dev',
        source: 'web',
        upvotes: 9,
      }),
      analyzeItemOnTheFly({
        text: 'The Superagent feature generated our complete user onboarding funnel in 30 seconds!',
        author: 'sarah_pm',
        source: 'discord',
        upvotes: 14,
      }),
      analyzeItemOnTheFly({
        text: 'MongoDB connection pool timeouts observed during high concurrent bursts.',
        author: 'enterprise_dan',
        source: 'github',
        upvotes: 5,
      }),
      analyzeItemOnTheFly({
        text: 'Can we enforce Row-Level Security policies inside Superagent tool executions?',
        author: 'security_lead',
        source: 'curl',
        upvotes: 11,
      }),
    ];
  });

  const [inputText, setInputText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [showCurlModal, setShowCurlModal] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [lastAgentLog, setLastAgentLog] = useState<string>(
    'Pulse44 Superagent Active • Triaged 4 audience items • Consensus ready'
  );

  const simulatorIndexRef = useRef(0);

  // Compute live stats on the fly
  const stats: DynamicStats = computeStatsOnTheFly(items);

  // Ingest on the fly
  const ingestMessage = (text: string, author = 'meetup_guest', source: IngestedItem['source'] = 'web') => {
    const analyzed = analyzeItemOnTheFly({
      text,
      author,
      source,
      upvotes: 1,
    });

    setItems(prev => [analyzed, ...prev]);

    setLastAgentLog(
      `Agent triaged input from @${analyzed.author} -> Intent: ${analyzed.intent.toUpperCase()} -> Topics: [${analyzed.topics.map(t => `#${t}`).join(', ')}] (6ms)`
    );

    if (analyzed.intent === 'praise') {
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.85 } });
      } catch {}
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    ingestMessage(inputText.trim(), authorName.trim() || undefined);
    setInputText('');
  };

  const handleUpvote = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );
  };

  // Connect to SSE (/api/stream)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_FEEDBACK' && payload.item) {
            ingestMessage(payload.item.text, payload.item.author, payload.item.source || 'curl');
          }
        } catch {}
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Simulator loop
  useEffect(() => {
    if (!isSimulatorActive) return;

    const interval = setInterval(() => {
      const nextSim = SIMULATOR_POOL[simulatorIndexRef.current % SIMULATOR_POOL.length];
      simulatorIndexRef.current++;
      ingestMessage(nextSim.text, nextSim.author, 'simulator');
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulatorActive]);

  // Filtered & Sorted items
  const displayItems = [...items]
    .filter(item => (selectedTopic ? item.topics.includes(selectedTopic) : true))
    .sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const curlCommand = `curl -X POST http://${window.location.hostname}:5173/api/feedback \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Does Base44 support WebSocket connection pooling in Deno?", "author": "@meetup_guest"}'`;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col bg-mesh">
      {/* 1. Header with Brand & Quick Toggles */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-cyan-500 p-[1px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-[#0D111C] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Pulse<span className="text-brand-400">44</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                  Live Meetup Q&A Agent
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Auto simulator toggle */}
            <button
              onClick={() => setIsSimulatorActive(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                isSimulatorActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-surface-50 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isSimulatorActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>Auto-Feed: {isSimulatorActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* cURL modal trigger */}
            <button
              onClick={() => setShowCurlModal(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-50 text-cyan-400 border border-slate-800 hover:border-cyan-500/40"
            >
              <Terminal className="w-3 h-3" />
              <span>cURL</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* HERO CONSENSUS BANNER: The AI Room Intelligence */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-brand-500/30 bg-gradient-to-r from-brand-950/30 via-surface-100/90 to-surface-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                Live Room Consensus
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Autonomous Synthesis
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {stats.aiExecutiveSummary}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto font-mono text-xs">
            <div className="text-center px-3 py-1.5 rounded-xl bg-surface-50 border border-slate-800">
              <div className="text-base font-bold text-white">{items.length}</div>
              <div className="text-[9px] text-slate-400 uppercase">Inputs</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-surface-50 border border-slate-800">
              <div className="text-base font-bold text-emerald-400">{stats.avgSentimentScore}%</div>
              <div className="text-[9px] text-slate-400 uppercase">Sentiment</div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN BALANCED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Input, Presets & Top Topics Chart (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Ask / Submit Input Box */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
              <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Ask a Question / Drop Feedback
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Type a question or comment..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-surface-200 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="@your_name (optional)"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-surface-200 border border-slate-700 text-slate-300 placeholder-slate-500 font-mono focus:outline-none focus:border-brand-500"
                  />

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>

              {/* 1-Click Demo Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Instant Demo Clicks:
                </div>
                <div className="flex flex-col gap-1.5">
                  {DEMO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => ingestMessage(p.text, 'meetup_guest')}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-800 hover:border-brand-500/40 text-left text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{p.label}</span>
                      <span className="text-[10px] font-mono text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        +Send
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SINGLE CORE CHART: Top Topics in the Room */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-brand-400" />
                    Top Topics in the Room
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Extracted dynamically from vocabulary
                  </p>
                </div>
                {selectedTopic && (
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="h-44 w-full">
                {stats.topTopics.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topTopics.slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="topic"
                        tick={{ fontSize: 10, fill: '#E2E8F0' }}
                        axisLine={false}
                        width={70}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as { topic: string; count: number };
                            return (
                              <div className="rounded-lg p-2 bg-[#0D111C] border border-slate-700 text-xs shadow-xl font-mono">
                                <span className="text-brand-300 font-bold">#{data.topic}</span>: {data.count} mentions
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {stats.topTopics.slice(0, 5).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                    No topics yet...
                  </div>
                )}
              </div>
            </div>

            {/* Agent Live Ticker */}
            <div className="p-3 rounded-xl bg-[#070A11] border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="truncate">{lastAgentLog}</span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Live Audience Q&A Stream (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  Live Audience Q&A
                </h2>
                <span className="text-xs font-mono bg-surface-50 text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">
                  {displayItems.length}
                </span>
                {selectedTopic && (
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    #{selectedTopic}
                  </span>
                )}
              </div>

              {/* Sort pills */}
              <div className="flex items-center gap-1 bg-surface-100 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSortBy('upvotes')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    sortBy === 'upvotes' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Top Voted</span>
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    sortBy === 'recent' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Newest
                </button>
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-2.5">
              {displayItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-surface-100/90 border-brand-500/40 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/20'
                      : 'bg-surface-200/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Badge row */}
                      <div className="flex items-center gap-2">
                        {item.intent === 'question' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            <HelpCircle className="w-2.5 h-2.5 text-cyan-400" /> QUESTION
                          </span>
                        ) : item.intent === 'bug' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> BUG
                          </span>
                        ) : item.intent === 'praise' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <Heart className="w-2.5 h-2.5 text-emerald-400 fill-current" /> PRAISE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Lightbulb className="w-2.5 h-2.5 text-amber-400" /> FEATURE
                          </span>
                        )}

                        <span className="text-[11px] font-semibold text-slate-300">
                          @{item.author}
                        </span>

                        <span className="text-[10px] font-mono text-slate-500">
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Text */}
                      <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed">
                        {item.text}
                      </p>

                      {/* Topic chips */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {item.topics.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTopic(t)}
                            className="text-[10px] font-mono text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-1.5 py-0.5 rounded border border-brand-500/20 transition-colors"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvote(item.id)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-100 hover:bg-brand-600/20 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/50 transition-all shrink-0 active:scale-95 group"
                    >
                      <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs font-bold mt-1 text-white">
                        {item.upvotes}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* cURL Modal */}
      {showCurlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow bg-[#0D111C] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Post to Live Screen via cURL
                </h3>
              </div>
              <button
                onClick={() => setShowCurlModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-0.5 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anyone on this Wi-Fi can run this command to submit questions straight to the screen:
            </p>

            <pre className="p-3 rounded-xl bg-[#070A11] border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap overflow-x-auto">
              {curlCommand}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(curlCommand);
                  setCopiedCurl(true);
                  setTimeout(() => setCopiedCurl(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
