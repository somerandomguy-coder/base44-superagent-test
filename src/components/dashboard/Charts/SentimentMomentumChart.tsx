import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SentimentDataPoint } from '@/types/generativeUI';

interface SentimentMomentumChartProps {
  data: SentimentDataPoint[];
}

export const SentimentMomentumChart: React.FC<SentimentMomentumChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Sentiment & NPS Trajectory
          </h2>
          <p className="text-xs text-slate-400">
            Real-time percentage mix and Net Promoter score momentum
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
          7-Day Window
        </span>
      </div>

      <div className="h-64 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickFormatter={val => `${val}%`}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl p-3 bg-[#0D111C]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs">
                      <div className="font-semibold text-white mb-2">{label}</div>
                      <div className="space-y-1">
                        {payload.map((entry, idx) => (
                          <div key={`entry-${idx}`} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-slate-200">{entry.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px', color: '#94A3B8' }}
            />
            <Area
              type="monotone"
              dataKey="positive"
              name="Positive"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#positiveGradient)"
              activeDot={{ r: 5, stroke: '#10B981', fill: '#090D16', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              name="Neutral"
              stroke="#06B6D4"
              strokeWidth={1.8}
              fill="url(#neutralGradient)"
            />
            <Area
              type="monotone"
              dataKey="negative"
              name="Critical / Negative"
              stroke="#F43F5E"
              strokeWidth={2}
              fill="url(#negativeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
