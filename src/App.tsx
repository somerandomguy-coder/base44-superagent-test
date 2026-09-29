import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { MetricCardsGrid } from '@/components/dashboard/MetricCardsGrid';
import { SentimentMomentumChart } from '@/components/dashboard/Charts/SentimentMomentumChart';
import { FeaturePaybackCDFChart } from '@/components/dashboard/Charts/FeaturePaybackCDFChart';
import { CategoryBreakdownChart } from '@/components/dashboard/Charts/CategoryBreakdownChart';
import { ActionItemsPanel } from '@/components/dashboard/ActionItemsPanel';
import { FeedbackFeedTable } from '@/components/dashboard/FeedbackFeedTable';
import { StateMachineVisualizer } from '@/components/inspector/StateMachineVisualizer';
import { ScratchpadReflectionLab } from '@/components/inspector/ScratchpadReflectionLab';
import { ReActExecutionLog } from '@/components/inspector/ReActExecutionLog';
import { Base44ArchitectureView } from '@/components/bridge/Base44ArchitectureView';
import { NewFeedbackModal } from '@/components/modals/NewFeedbackModal';

import { stateMachineEngineInstance } from '@/lib/stateMachineEngine';
import { StateMachineContext } from '@/types/stateMachine';
import { GenerativeDashboardSpec } from '@/types/generativeUI';
import { FeedbackItem } from '@/types/feedback';
import { INITIAL_FEEDBACK_ITEMS } from '@/lib/mockData';
import { Sparkles, Terminal, ShieldCheck, Heart } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'inspector' | 'bridge'>('dashboard');
  const [context, setContext] = useState<StateMachineContext>(stateMachineEngineInstance.getContext());
  const [spec, setSpec] = useState<GenerativeDashboardSpec>(stateMachineEngineInstance.getCurrentSpec());
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(INITIAL_FEEDBACK_ITEMS);
  const [isNewFeedbackOpen, setIsNewFeedbackOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = stateMachineEngineInstance.subscribe((newContext, newSpec) => {
      setContext(newContext);
      if (newSpec) {
        setSpec(newSpec);
      }
    });
    return unsubscribe;
  }, []);

  const handleRunPipeline = (simulateCorruption = false) => {
    stateMachineEngineInstance.runSuperagentPipeline({
      simulateCorruption,
      autoHeal: context.autoHealEnabled,
    });
  };

  const handleToggleAutoHeal = (enabled: boolean) => {
    setContext(prev => ({ ...prev, autoHealEnabled: enabled }));
  };

  const handleAddFeedback = (newItem: FeedbackItem) => {
    setFeedbackItems(prev => [newItem, ...prev]);
    // Automatically trigger state machine pipeline
    stateMachineEngineInstance.runSuperagentPipeline({
      simulateCorruption: false,
      itemsCount: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col bg-mesh">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        context={context}
        onRunPipeline={handleRunPipeline}
        onOpenNewFeedback={() => setIsNewFeedbackOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: LIVE GENERATIVE DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* AI Executive Summary Card */}
            <ExecutiveSummary spec={spec} />

            {/* KPI Cards Grid */}
            <MetricCardsGrid kpis={spec.kpis} />

            {/* Visual Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Trajectory Area Chart */}
              <SentimentMomentumChart data={spec.sentimentMomentum} />

              {/* Payback CDF Probability Chart */}
              <FeaturePaybackCDFChart data={spec.featurePaybackCdf} />
            </div>

            {/* Category & Root Cause Breakdown Bar Chart */}
            <CategoryBreakdownChart data={spec.categoryBreakdown} />

            {/* Prioritized Engineering Action Items */}
            <ActionItemsPanel actionItems={spec.actionItems} />

            {/* Real-time Multi-Channel Feedback Ingest Stream */}
            <FeedbackFeedTable items={feedbackItems} />
          </div>
        )}

        {/* VIEW 2: SUPERAGENT SYSTEMS INSPECTOR */}
        {currentView === 'inspector' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 6-Stage Deterministic State Machine Flow */}
            <StateMachineVisualizer context={context} />

            {/* Scratchpad Diagnostic & Reflection Lab */}
            <ScratchpadReflectionLab
              context={context}
              onRunTestCorruption={() => handleRunPipeline(true)}
              onToggleAutoHeal={handleToggleAutoHeal}
            />

            {/* Live ReAct Execution Terminal Log */}
            <ReActExecutionLog logs={context.logs} />
          </div>
        )}

        {/* VIEW 3: BASE44 ARCHITECTURE & DENO BRIDGE */}
        {currentView === 'bridge' && (
          <Base44ArchitectureView />
        )}
      </main>

      {/* New Feedback Submission Modal */}
      <NewFeedbackModal
        isOpen={isNewFeedbackOpen}
        onClose={() => setIsNewFeedbackOpen(false)}
        onSubmit={handleAddFeedback}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090D16]/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">BasePulse OS</span>
            <span>•</span>
            <span>Base44 Superagent Architecture & Generative UI</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Deno V8 Subhosting: Ready
            </span>
            <span className="flex items-center gap-1 text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zod Contracts: Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
