import React, { useState, useEffect, useRef } from 'react';
import { 
  IngestedItem, 
  DynamicStats, 
  analyzeItemOnTheFly, 
  computeStatsOnTheFly, 
  INITIAL_LIVE_SEED 
} from '@/lib/onTheFlyAnalyzer';
import { LiveFeedHeader } from '@/components/live/LiveFeedHeader';
import { DynamicMetricsBar } from '@/components/live/DynamicMetricsBar';
import { DynamicChartsGrid } from '@/components/live/DynamicChartsGrid';
import { LiveAgentReasoningBox } from '@/components/live/LiveAgentReasoningBox';
import { LiveFeedStream } from '@/components/live/LiveFeedStream';
import { Sparkles, Terminal, Activity, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const SIMULATOR_POOL = [
  { text: 'Does Base44 support WebSocket subprotocols in Deno serverless functions?', author: 'concurrency_guru' },
  { text: 'The Generative UI hot-swapped our dashboard in 40ms without dropping React state. Insane!', author: 'frontend_lead' },
  { text: 'Memory spike detected on cold start when MongoDB driver parses large schema definitions.', author: 'telemetry_bot' },
  { text: 'Can we configure custom Row-Level Security policies per user organization?', author: 'security_auditor' },
  { text: 'What is the maximum execution timeout for Superagent tool loops in Deno isolates?', author: 'curious_dev' },
  { text: 'Feature request: Add automated linear ticket generation from triaged bug reports.', author: 'product_vp' },
  { text: 'OAuth session cookie refresh fails silently on mobile browsers when cookies are blocked.', author: 'auth_tester' },
  { text: 'The Recharts integration with custom tooltips is super clean and responsive!', author: 'designer_dan' },
  { text: 'How do you handle schema reflection when an LLM produces hallucinated JSON types?', author: 'systems_eng' },
  { text: 'Superagent triaged 40 customer bug reports in under a minute. Huge productivity boost!', author: 'founder_sam' },
];

export function App() {
  const [items, setItems] = useState<IngestedItem[]>(() => {
    return INITIAL_LIVE_SEED.map(raw => analyzeItemOnTheFly(raw));
  });

  const [stats, setStats] = useState<DynamicStats>(() => {
    const initialItems = INITIAL_LIVE_SEED.map(raw => analyzeItemOnTheFly(raw));
    return computeStatsOnTheFly(initialItems);
  });

  const [agentLogs, setAgentLogs] = useState<string[]>([
    'BasePulse Superagent initialized. Ready to ingest comments, questions, and feedback on the fly.',
    'Deno Isolate execution engine listening on /api/feedback & SSE /api/stream.',
  ]);

  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);

  const simulatorIndexRef = useRef(0);

  // 1. Ingest function executed on the fly
  const ingestRawItem = (text: string, author = 'guest_user', source: IngestedItem['source'] = 'web') => {
    const analyzed = analyzeItemOnTheFly({
      text,
      author,
      source,
    });

    setItems(prev => {
      const updated = [analyzed, ...prev];
      // Recompute stats on the fly
      const newStats = computeStatsOnTheFly(updated);
      setStats(newStats);
      return updated;
    });

    // Add Agent reasoning log
    const logMsg = `[INGEST ON-THE-FLY] "${analyzed.text.slice(0, 32)}..." from @${analyzed.author} -> ${analyzed.wordCount} words -> Intent: ${analyzed.intent.toUpperCase()} -> Topics: [${analyzed.topics.map(t => `#${t}`).join(', ')}] -> Sentiment: ${analyzed.sentimentScore}% (Recalculated in 8ms)`;
    setAgentLogs(prev => [logMsg, ...prev.slice(0, 19)]);

    if (analyzed.intent === 'praise') {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.9 } });
      } catch {}
    }
  };

  // 2. Connect to local SSE stream (/api/stream)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stream');
      eventSource.onopen = () => {
        setSseConnected(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_FEEDBACK' && payload.item) {
            ingestRawItem(payload.item.text, payload.item.author, payload.item.source || 'curl');
          }
        } catch {}
      };
      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch {
      setSseConnected(false);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // 3. Auto-Feed Simulator Timer
  useEffect(() => {
    if (!isSimulatorActive) return;

    const interval = setInterval(() => {
      const nextSim = SIMULATOR_POOL[simulatorIndexRef.current % SIMULATOR_POOL.length];
      simulatorIndexRef.current++;
      ingestRawItem(nextSim.text, nextSim.author, 'simulator');
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatorActive]);

  const handleClear = () => {
    setItems([]);
    setStats(computeStatsOnTheFly([]));
    setAgentLogs(['Stream cleared. Awaiting new incoming comments...']);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col bg-mesh">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-500 p-[1px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-[#0D111C] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                  Base<span className="text-brand-400">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                  Live Feed Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                On-the-Fly Ingestion, Dynamic Word Counts, and Topic Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 border border-slate-800 text-slate-300">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{items.length} items live</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Deno Isolate Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Live Feed Ingest Header (Input bar, presets, simulator, cURL) */}
        <LiveFeedHeader
          onSendFeedback={ingestRawItem}
          isSimulatorActive={isSimulatorActive}
          onToggleSimulator={() => setIsSimulatorActive(prev => !prev)}
          sseConnected={sseConnected}
        />

        {/* 2. Dynamic Metrics Bar (Generated on the fly) */}
        <DynamicMetricsBar stats={stats} />

        {/* 3. Dynamic Charts Grid (Topic Frequency, Sentiment Velocity, Word Distribution) */}
        <DynamicChartsGrid stats={stats} />

        {/* 4. Agent Reasoning Stream & Topic Cloud */}
        <LiveAgentReasoningBox
          stats={stats}
          latestItem={items[0] || null}
          agentLogs={agentLogs}
          selectedTopicFilter={selectedTopicFilter}
          onSelectTopicFilter={setSelectedTopicFilter}
        />

        {/* 5. Live Ingested Feed Stream */}
        <LiveFeedStream
          items={items}
          selectedTopicFilter={selectedTopicFilter}
          onClearItems={handleClear}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090D16]/90 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">BasePulse Live</span>
            <span>•</span>
            <span>Realtime Product Feedback & Question Ingestion Superagent</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>POST /api/feedback</span>
            <span>•</span>
            <span>SSE /api/stream</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
