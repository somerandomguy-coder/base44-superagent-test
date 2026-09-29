import React, { useState } from 'react';
import { 
  Inbox, 
  Filter, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Activity, 
  HelpCircle 
} from 'lucide-react';
import { AgentStage, StateMachineContext } from '@/types/stateMachine';
import { STAGE_DEFINITIONS } from '@/lib/mockData';

interface StateMachineVisualizerProps {
  context: StateMachineContext;
}

export const StateMachineVisualizer: React.FC<StateMachineVisualizerProps> = ({ context }) => {
  const [selectedStageId, setSelectedStageId] = useState<AgentStage>(context.currentStage);

  const getStageIcon = (iconName: string, isCurrent: boolean) => {
    const props = { className: `w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}` };
    switch (iconName) {
      case 'Inbox':
        return <Inbox {...props} />;
      case 'Filter':
        return <Filter {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Zap':
      default:
        return <Zap {...props} />;
    }
  };

  const selectedDef = STAGE_DEFINITIONS.find(s => s.id === selectedStageId) || STAGE_DEFINITIONS[0];

  const getStageStatus = (stageId: AgentStage) => {
    const order: AgentStage[] = [
      'INGESTING',
      'TRIAGING',
      'BATCH_BUFFER',
      'SYNTHESIZING',
      'VALIDATING',
      'LIVE_DEPLOY',
    ];
    const currentIndex = order.indexOf(context.currentStage);
    const stageIndex = order.indexOf(stageId);

    if (context.status === 'running') {
      if (stageIndex === currentIndex) return 'active';
      if (stageIndex < currentIndex) return 'completed';
      return 'pending';
    }
    if (context.status === 'error' && stageIndex === currentIndex) {
      return 'error';
    }
    return 'idle';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Deterministic State Machine Pipeline
            </h2>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20">
              6-Stage Isolation
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Guarantees deterministic execution states rather than loose LLM autonomy
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Batch ID: <strong className="text-brand-300">{context.batchId}</strong>
          </span>
          <span className="text-slate-400">
            Payloads: <strong className="text-emerald-400">{context.activeItemsCount} items</strong>
          </span>
        </div>
      </div>

      {/* 6-Stage Horizontal Interactive Node Flow */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
        {STAGE_DEFINITIONS.map((stage, idx) => {
          const status = getStageStatus(stage.id);
          const isSelected = selectedStageId === stage.id;
          const isCurrent = context.currentStage === stage.id;

          let cardStyle = 'bg-surface-100/80 border-slate-800 text-slate-400 hover:border-slate-700';
          let iconBadgeStyle = 'bg-surface-50 text-slate-400 border-slate-700';

          if (isCurrent && context.status === 'running') {
            cardStyle = 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30';
            iconBadgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
          } else if (status === 'completed' || (context.status === 'success' && stage.id === 'LIVE_DEPLOY')) {
            cardStyle = 'bg-surface-100/90 border-emerald-500/30 text-slate-200';
            iconBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          } else if (status === 'error') {
            cardStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-300';
            iconBadgeStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          }

          if (isSelected) {
            cardStyle += ' ring-2 ring-brand-500/50 border-brand-500';
          }

          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${cardStyle}`}
            >
              {/* Node Top Indicator */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-lg border ${iconBadgeStyle}`}>
                  {getStageIcon(stage.iconName, isCurrent)}
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  0{idx + 1}
                </span>
              </div>

              {/* Title & Short description */}
              <div className="font-bold text-xs text-white group-hover:text-brand-300 transition-colors">
                {stage.label.split('. ')[1]}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {stage.shortDesc}
              </div>

              {/* Status pill */}
              <div className="mt-3 pt-2 w-full border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="capitalize text-slate-500">
                  {status === 'active' ? (
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 animate-spin" /> In Progress
                    </span>
                  ) : status === 'completed' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Done
                    </span>
                  ) : status === 'error' ? (
                    <span className="text-rose-400">Failed</span>
                  ) : (
                    <span>Ready</span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Architecture Deep Dive Card */}
      <div className="p-4 rounded-xl bg-surface-200/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-400 uppercase">
              Stage Deep Dive: {selectedDef.label}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Subagent: {selectedDef.subagentName}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {selectedDef.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs font-mono text-slate-400 bg-surface-100 px-3 py-1.5 rounded-lg border border-slate-800">
          <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
          <span>V8 Micro-Isolate Sandbox</span>
        </div>
      </div>
    </div>
  );
};
