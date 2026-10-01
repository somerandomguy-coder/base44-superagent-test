import React from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DynamicStats } from '@/lib/onTheFlyAnalyzer';
import { Sparkles, TrendingUp, BarChart3, Layers } from 'lucide-react';

interface DynamicChartsGridProps {
  stats: DynamicStats;
}

const TOPIC_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#A78BFA', '#38BDF8'];

export const DynamicChartsGrid: React.FC<DynamicChartsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Dynamic Topic Frequency (Horizontal Bar) */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Live Topic Frequency
            </h2>
            <p className="text-[11px] text-slate-400">
              Extracted on the fly from incoming vocabulary
            </p>
          </div>
          <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            Realtime
          </span>
        </div>

        <div className="h-56 w-full">
          {stats.topTopics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topTopics}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="topic"
                  tick={{ fontSize: 11, fill: '#E2E8F0' }}
                  axisLine={false}
                  width={75}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as { topic: string; count: number; percentage: number };
                      return (
                        <div className="rounded-xl p-2.5 bg-[#0D111C]/95 border border-slate-700 text-xs shadow-xl font-mono">
                          <span className="text-brand-300 font-bold">#{data.topic}</span>
                          <div className="text-slate-300 mt-1">
                            Occurrences: <strong className="text-white">{data.count}</strong> ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.topTopics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting topics...
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Real-time Sentiment Velocity (Area Chart) */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Sentiment Velocity Curve
            </h2>
            <p className="text-[11px] text-slate-400">
              Per-item score trajectory (Recent 15 inputs)
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            0-100%
          </span>
        </div>

        <div className="h-56 w-full">
          {stats.sentimentVelocity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sentimentVelocity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as { label: string; score: number; intent: string };
                      return (
                        <div className="rounded-xl p-2.5 bg-[#0D111C]/95 border border-slate-700 text-xs shadow-xl font-mono">
                          <div className="text-slate-400">Input {data.label}</div>
                          <div className="text-white font-bold mt-0.5">
                            Sentiment: <span className="text-cyan-400">{data.score}%</span>
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">Intent: {data.intent}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fill="url(#sentimentVelocityGrad)"
                  activeDot={{ r: 5, stroke: '#06B6D4', strokeWidth: 2, fill: '#090D16' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting data points...
            </div>
          )}
        </div>
      </div>

      {/* Chart 3: Word Length Distribution Histogram */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Word Count Distribution
            </h2>
            <p className="text-[11px] text-slate-400">
              Message verbosity breakdown
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Word Depth
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.wordLengthDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as { range: string; count: number };
                    return (
                      <div className="rounded-xl p-2.5 bg-[#0D111C]/95 border border-slate-700 text-xs shadow-xl font-mono">
                        <div className="text-slate-300">Length: {data.range}</div>
                        <div className="text-emerald-400 font-bold mt-0.5">{data.count} items</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
