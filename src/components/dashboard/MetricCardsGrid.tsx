import React from 'react';
import { 
  Smile, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  BarChart3 
} from 'lucide-react';
import { KPICardSpec } from '@/types/generativeUI';

interface MetricCardsGridProps {
  kpis: KPICardSpec[];
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({ kpis }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getColorStyles = (color: KPICardSpec['color']) => {
    switch (color) {
      case 'emerald':
        return {
          iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accent: 'text-emerald-400',
          borderHover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
        };
      case 'cyan':
        return {
          iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          accent: 'text-cyan-400',
          borderHover: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
        };
      case 'rose':
        return {
          iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accent: 'text-rose-400',
          borderHover: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
        };
      case 'amber':
        return {
          iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accent: 'text-amber-400',
          borderHover: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
        };
      case 'violet':
      default:
        return {
          iconBox: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
          accent: 'text-brand-400',
          borderHover: 'hover:border-brand-500/40 hover:shadow-brand-500/10',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(kpi => {
        const styles = getColorStyles(kpi.color);

        return (
          <div
            key={kpi.id}
            className={`glass-card rounded-xl p-5 border border-slate-800/80 shadow-md ${styles.borderHover} transition-all duration-200`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-lg border ${styles.iconBox}`}>
                {getIcon(kpi.icon)}
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                {kpi.value}
              </span>

              {kpi.changePercent !== 0 && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    kpi.trend === 'up'
                      ? 'text-emerald-400'
                      : kpi.trend === 'down'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : kpi.trend === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  {kpi.changePercent > 0 ? `+${kpi.changePercent}%` : `${kpi.changePercent}%`}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-400 leading-normal line-clamp-1">
              {kpi.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
