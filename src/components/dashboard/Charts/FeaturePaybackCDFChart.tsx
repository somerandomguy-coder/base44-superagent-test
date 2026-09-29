import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { PaybackCdfPoint } from '@/types/generativeUI';
import { Sparkles } from 'lucide-react';

interface FeaturePaybackCDFChartProps {
  data: {
    targetWeeks: number;
    medianWeeks: number;
    featureName: string;
    curve: PaybackCdfPoint[];
  };
}

export const FeaturePaybackCDFChart: React.FC<FeaturePaybackCDFChartProps> = ({ data }) => {
  const { curve, medianWeeks, featureName, targetWeeks } = data;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Payback & Retention CDF Curve
          </h2>
          <p className="text-xs text-slate-400">
            Cumulative probability distribution for: <span className="text-brand-300 font-medium">{featureName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded border border-brand-500/20">
            Median: {medianWeeks} wks
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Target: {targetWeeks} wks
          </span>
        </div>
      </div>

      <div className="h-64 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curve} margin={{ top: 10, right: 16, bottom: 4, left: -20 }}>
            <defs>
              <linearGradient id="paybackGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="weeks"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `Wk ${v}`}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1.0]}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload as PaybackCdfPoint;
                  return (
                    <div className="rounded-xl p-3 bg-[#0D111C]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs">
                      <div className="font-semibold text-brand-300 mb-1">
                        Timeline: Week {label}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Cumulative Probability:</span>
                          <span className="font-mono font-bold text-white">
                            {(point.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">ARR Retention Boost:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            +{point.expectedRetentionBoost}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {medianWeeks && (
              <ReferenceLine
                x={medianWeeks}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Median (${medianWeeks}w)`,
                  fill: '#F59E0B',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="probability"
              name="Probability"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#paybackGlow)"
              activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#090D16' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
