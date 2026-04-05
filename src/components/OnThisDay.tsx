import React from 'react';
import { motion } from 'motion/react';
import { Lie } from '../types';
import { CalendarDays } from 'lucide-react';

export const OnThisDay = ({ lies }: { lies: Lie[] }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const onThisDayLies = lies.filter(lie => {
    const lieDate = new Date(lie.date);
    return lieDate.getMonth() === currentMonth && lieDate.getDate() === currentDate && lieDate.getFullYear() !== today.getFullYear();
  });

  if (onThisDayLies.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-3xl border border-white/30 rounded-[2rem] p-8 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <CalendarDays className="w-32 h-32 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <CalendarDays className="w-6 h-6" />
        On This Day
      </h2>
      <p className="text-purple-100 text-sm mb-6">Memories of past fictions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onThisDayLies.map(lie => {
          const yearsAgo = today.getFullYear() - new Date(lie.date).getFullYear();
          return (
            <div key={lie.id} className="bg-white/40 rounded-2xl p-5 border border-white/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                {yearsAgo} {yearsAgo === 1 ? 'YEAR' : 'YEARS'} AGO
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 pr-16">{lie.name}</h3>
              <p className="text-sm text-gray-800 mb-1"><span className="font-semibold text-purple-900/70">Who:</span> {lie.who}</p>
              <p className="text-sm text-gray-800"><span className="font-semibold text-purple-900/70">What:</span> {lie.what}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
