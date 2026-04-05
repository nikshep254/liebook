import React from 'react';
import { motion } from 'motion/react';
import { Lie } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame } from 'lucide-react';

export const AnalyticsDashboard = ({ lies }: { lies: Lie[] }) => {
  const totalLies = lies.length;
  const bustedCount = lies.filter(l => l.status === 'busted').length;
  const safeCount = lies.filter(l => l.status === 'safe').length;
  const activeCount = lies.filter(l => l.status === 'active').length;
  
  const avgSeverity = totalLies > 0 
    ? (lies.reduce((acc, l) => acc + (l.severity || 1), 0) / totalLies).toFixed(1)
    : 0;

  const topTargets = lies.reduce((acc, l) => {
    acc[l.who] = (acc[l.who] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostLiedTo = Object.entries(topTargets).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-12 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-[2rem] p-8 overflow-hidden"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        Lie Analytics & Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/40 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-sm font-bold text-orange-900/60 uppercase tracking-wider">Total Fictions</span>
          <span className="text-4xl font-black text-gray-900">{totalLies}</span>
        </div>
        
        <div className="bg-white/40 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-sm font-bold text-orange-900/60 uppercase tracking-wider">Average Guilt</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-gray-900">{avgSeverity}</span>
            <Flame className="w-6 h-6 text-orange-600 mb-1" />
          </div>
        </div>
        
        <div className="bg-white/40 rounded-2xl p-5 flex flex-col gap-3">
          <span className="text-sm font-bold text-orange-900/60 uppercase tracking-wider">Status Breakdown</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-medium text-green-800">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Safe</span>
              <span>{safeCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-yellow-800">
              <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Active</span>
              <span>{activeCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-red-800">
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Busted</span>
              <span>{bustedCount}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/40 rounded-2xl p-5 flex flex-col gap-3">
          <span className="text-sm font-bold text-orange-900/60 uppercase tracking-wider">Most Lied To</span>
          <div className="flex flex-col gap-2">
            {mostLiedTo.map(([who, count], i) => (
              <div key={who} className="flex items-center justify-between text-sm font-medium text-gray-800">
                <span className="truncate pr-2">{i + 1}. {who}</span>
                <span className="bg-white/50 px-2 py-0.5 rounded-md">{count}</span>
              </div>
            ))}
            {mostLiedTo.length === 0 && <span className="text-sm text-gray-600 italic">No data yet</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
