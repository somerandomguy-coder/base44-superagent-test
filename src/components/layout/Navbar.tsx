import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  LayoutDashboard, 
  Code2, 
  Play, 
  Bug, 
  PlusCircle, 
  Cpu, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw 
} from 'lucide-react';
import { StateMachineContext } from '@/types/stateMachine';

interface NavbarProps {
  currentView: 'dashboard' | 'inspector' | 'bridge';
  onSelectView: (view: 'dashboard' | 'inspector' | 'bridge') => void;
  context: StateMachineContext;
  onRunPipeline: (corrupted?: boolean) => void;
  onOpenNewFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  context,
  onRunPipeline,
  onOpenNewFeedback,
}) => {
  const isRunning = context.status === 'running';

  const getStageBadgeColor = () => {
    switch (context.currentStage) {
      case 'LIVE_DEPLOY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'VALIDATING':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/40 animate-pulse';
      case 'INGESTING':
      case 'TRIAGING':
      case 'BATCH_BUFFER':
      case 'SYNTHESIZING':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Platform Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-500 p-[1px] shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-[#0D111C] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#090D16]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Base<span className="text-brand-400">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                Superagent OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Base44 Deterministic State Machine & Generative UI
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-surface-100/90 border border-slate-800 shadow-inner">
          <button
            id="tab-live-dashboard"
            onClick={() => onSelectView('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-brand-600/90 to-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Generative Dashboard</span>
          </button>

          <button
            id="tab-superagent-inspector"
            onClick={() => onSelectView('inspector')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'inspector'
                ? 'bg-gradient-to-r from-brand-600/90 to-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1.5">
              Superagent Inspector
              {context.latestDiagnostic?.hasErrors && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </span>
          </button>

          <button
            id="tab-base44-bridge"
            onClick={() => onSelectView('bridge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'bridge'
                ? 'bg-gradient-to-r from-brand-600/90 to-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Base44 Architecture & Deno</span>
          </button>
        </nav>

        {/* Live State Badge & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Active State Pill */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${getStageBadgeColor()}`}>
            {isRunning ? (
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            ) : context.status === 'error' ? (
              <AlertOctagon className="w-3 h-3 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            )}
            <span className="font-semibold">{context.currentStage}</span>
          </div>

          {/* Simulate Schema Corruption & Self-Healing Trigger */}
          <button
            id="btn-corrupt-reflection-demo"
            onClick={() => onRunPipeline(true)}
            disabled={isRunning}
            title="Inject invalid schema tokens to watch the Scratchpad Reflection Loop auto-heal in real time!"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all disabled:opacity-50"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Test Reflection Self-Heal</span>
            <span className="xl:hidden">Self-Heal Demo</span>
          </button>

          {/* Trigger Normal Ingest Pipeline */}
          <button
            id="btn-run-pipeline"
            onClick={() => onRunPipeline(false)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50 active:scale-95"
          >
            {isRunning ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Superagent Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ingest Batch</span>
              </>
            )}
          </button>

          {/* Add Feedback */}
          <button
            id="btn-open-new-feedback"
            onClick={onOpenNewFeedback}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-50 border border-slate-800 transition-colors"
            title="Submit user feedback or test preset"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
