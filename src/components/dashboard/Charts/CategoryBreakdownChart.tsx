import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdownPoint } from '@/types/generativeUI';

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownPoint[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Root-Cause & Category Distribution
          </h2>
          <p className="text-xs text-slate-400">
            Automated clustering of bug escalations vs requested enhancements
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          Superagent Clustered
        </span>
      </div>

      <div className="h-64 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={{ stroke: '#334155' }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
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
                            <span className="font-mono font-bold text-slate-200">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} />
            <Bar
              dataKey="bugCount"
              name="Bugs & Issues"
              fill="#F43F5E"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="featureRequestCount"
              name="Feature Requests"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="urgentCount"
              name="P0 Escalations"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
