import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search, ArrowUpDown, Trash2, CheckCircle2, Minus, Maximize2, Download, Flame, ShieldAlert, ShieldCheck, AlertTriangle, Calendar, Lock, Unlock, Sparkles, BarChart3, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';

import { Lie, Severity, Status } from './types';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WebOfLiesGraph } from './components/WebOfLiesGraph';
import { OnThisDay } from './components/OnThisDay';

const initialLies: Lie[] = [
  {
    id: '1',
    name: 'I read the terms and conditions',
    who: 'Apple Inc.',
    what: 'Software Update',
    where: 'My iPhone',
    why: 'To use the phone',
    date: '2026-01-15T00:00:00Z',
    severity: 1,
    status: 'safe',
    tags: ['#tech', '#excuses']
  },
  {
    id: '2',
    name: 'I am almost there',
    who: 'Friends',
    what: 'Dinner party',
    where: 'Still in bed',
    why: 'Too lazy to get up',
    date: '2026-02-10T00:00:00Z',
    severity: 3,
    status: 'active',
    tags: ['#friends', '#lazy']
  },
  {
    id: '3',
    name: 'My dog ate my homework',
    who: 'Professor Smith',
    what: 'Math Assignment',
    where: 'Classroom 101',
    why: 'Forgot to do it',
    date: '2026-03-05T00:00:00Z',
    severity: 5,
    status: 'busted',
    tags: ['#school', '#classic']
  }
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Timeline = ({ selectedMonth, onMonthSelect }: { selectedMonth: string | null, onMonthSelect: (month: string | null) => void }) => {
  return (
    <div className="w-full py-12 overflow-x-auto hide-scrollbar">
      <div className="flex items-center min-w-max px-4 md:px-8">
        <button 
          onClick={() => onMonthSelect(null)}
          className={`text-4xl font-bold mr-12 tracking-tighter drop-shadow-sm transition-colors ${selectedMonth === null ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          2026
        </button>
        <div className="relative flex items-center">
          {/* The main horizontal line */}
          <div className="absolute left-0 right-0 h-[2px] bg-white/30 top-1/2 -translate-y-1/2 rounded-full"></div>
          
          {months.map((month, index) => {
            const isUp = index % 2 === 0;
            const isSelected = selectedMonth === month;
            return (
              <button 
                key={month} 
                onClick={() => onMonthSelect(isSelected ? null : month)}
                className="relative flex flex-col items-center w-24 group cursor-pointer focus:outline-none"
              >
                {isUp ? (
                  <>
                    <span className={`text-sm mb-3 font-medium tracking-wide transition-colors ${isSelected ? 'text-white font-bold scale-110' : 'text-orange-100 group-hover:text-white'}`}>{month}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border-[3px] z-10 transition-all duration-300 ${isSelected ? 'bg-white border-orange-500 scale-150 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-orange-500 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:scale-125'}`}></div>
                    <div className="h-8"></div>
                  </>
                ) : (
                  <>
                    <div className="h-8"></div>
                    <div className={`w-3.5 h-3.5 rounded-full border-[3px] z-10 transition-all duration-300 ${isSelected ? 'bg-white border-orange-500 scale-150 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-orange-500 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:scale-125'}`}></div>
                    <span className={`text-sm mt-3 font-medium tracking-wide transition-colors ${isSelected ? 'text-white font-bold scale-110' : 'text-orange-100 group-hover:text-white'}`}>{month}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LieCard = ({ lie, onEdit, onDelete }: { lie: Lie, onEdit: () => void, onDelete: (e: React.MouseEvent) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `confession-${lie.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch(severity) {
      case 1: return 'text-green-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-orange-500';
      case 4: return 'text-red-500';
      case 5: return 'text-purple-600';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBg = (severity: Severity) => {
    switch(severity) {
      case 1: return 'bg-green-500/10 border-green-500/20';
      case 2: return 'bg-yellow-500/10 border-yellow-500/20';
      case 3: return 'bg-orange-500/10 border-orange-500/20';
      case 4: return 'bg-red-500/10 border-red-500/20';
      case 5: return 'bg-purple-600/10 border-purple-600/20';
      default: return 'bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
      onClick={onEdit}
      className={`relative bg-white/80 backdrop-blur-3xl border rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/90 transition-all duration-300 shadow-lg cursor-pointer group overflow-hidden ${getSeverityBg(lie.severity)}`}
    >
      {lie.status === 'busted' && (
        <div className="absolute -right-6 top-10 rotate-45 bg-red-600 text-white font-black uppercase tracking-widest py-1 px-12 shadow-lg z-0 opacity-80 pointer-events-none">
          BUSTED!
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={handleExport}
          className="p-2 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
          title="Export as Confession Card"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Delete lie"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-0.5" title={`Severity: ${lie.severity}/5`}>
          {[...Array(5)].map((_, i) => (
            <Flame key={i} className={`w-4 h-4 ${i < lie.severity ? getSeverityColor(lie.severity) : 'text-gray-300'}`} fill={i < lie.severity ? 'currentColor' : 'none'} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-white/40 text-xs font-bold uppercase tracking-wider">
          {lie.status === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-green-600" />}
          {lie.status === 'active' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />}
          {lie.status === 'busted' && <ShieldAlert className="w-3.5 h-3.5 text-red-600" />}
          <span className={lie.status === 'safe' ? 'text-green-700' : lie.status === 'active' ? 'text-yellow-700' : 'text-red-700'}>
            {lie.status}
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight pr-16 relative z-10">{lie.name}</h3>
      
      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col gap-1 border border-white/40 shadow-sm">
          <span className="text-[10px] text-orange-800/70 uppercase font-bold tracking-widest">Who</span>
          <span className="text-sm text-gray-800 font-medium truncate" title={lie.who}>{lie.who}</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col gap-1 border border-white/40 shadow-sm">
          <span className="text-[10px] text-orange-800/70 uppercase font-bold tracking-widest">What</span>
          <span className="text-sm text-gray-800 font-medium truncate" title={lie.what}>{lie.what}</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col gap-1 border border-white/40 shadow-sm">
          <span className="text-[10px] text-orange-800/70 uppercase font-bold tracking-widest">Where</span>
          <span className="text-sm text-gray-800 font-medium truncate" title={lie.where}>{lie.where}</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col gap-1 border border-white/40 shadow-sm">
          <span className="text-[10px] text-orange-800/70 uppercase font-bold tracking-widest">Why</span>
          <span className="text-sm text-gray-800 font-medium truncate" title={lie.why}>{lie.why}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 relative z-10">
        <div className="flex flex-wrap gap-1.5">
          {lie.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-black/5 text-gray-700 rounded-md text-xs font-medium border border-black/5">
              {tag}
            </span>
          ))}
        </div>
        {lie.expirationDate && (
          <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100" title="Expiration Date">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(lie.expirationDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AddCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }}
      onClick={onClick}
      className="bg-white/20 border-2 border-dashed border-white/50 rounded-[2rem] p-6 flex items-center justify-center min-h-[320px] hover:bg-white/40 hover:border-white/80 transition-all duration-300 group cursor-pointer w-full"
    >
      <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/80 transition-all duration-300 shadow-sm">
        <Plus className="w-8 h-8 text-orange-600 transition-colors" />
      </div>
    </motion.button>
  );
};

const LieFormModal = ({ isOpen, onClose, onSave, initialData }: { isOpen: boolean, onClose: () => void, onSave: (lie: Omit<Lie, 'id' | 'date'>) => void, initialData?: Lie | null }) => {
  const [formData, setFormData] = useState<Omit<Lie, 'id' | 'date'>>({ 
    name: '', who: '', what: '', where: '', why: '', 
    severity: 1, status: 'active', tags: [], expirationDate: '' 
  });
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        who: initialData.who,
        what: initialData.what,
        where: initialData.where,
        why: initialData.why,
        severity: initialData.severity || 1,
        status: initialData.status || 'active',
        tags: initialData.tags || [],
        expirationDate: initialData.expirationDate || ''
      });
    } else {
      setFormData({ name: '', who: '', what: '', where: '', why: '', severity: 1, status: 'active', tags: [], expirationDate: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: '', who: '', what: '', where: '', why: '', severity: 1, status: 'active', tags: [], expirationDate: '' });
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
  };

  const generateAlibi = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        where: prev.where || 'At the library studying',
        why: prev.why || 'My phone died and I lost track of time',
        what: prev.what || 'A sudden emergency came up'
      }));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-orange-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl max-h-[90vh] bg-white/95 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none"></div>
            
            {/* macOS Controls */}
            <div className="flex items-center gap-2 px-8 pt-8 pb-2 relative z-20 shrink-0">
              <button type="button" onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center group transition-colors">
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button type="button" onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] flex items-center justify-center group transition-colors">
                <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button type="button" className="w-3.5 h-3.5 rounded-full bg-[#27c93f] flex items-center justify-center group transition-colors">
                <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
            </div>
            
            <div className="px-8 pb-8 pt-4 overflow-y-auto hide-scrollbar relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                {initialData ? 'Edit lie' : 'Store a new lie'}
              </h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Guilt Meter (Severity)</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: level as Severity })}
                      className={`p-1.5 rounded-full transition-all ${formData.severity >= level ? 'text-orange-500 bg-orange-100' : 'text-gray-300 hover:text-orange-300'}`}
                    >
                      <Flame className="w-5 h-5" fill={formData.severity >= level ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Heading (The Lie)</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 pr-32 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-lg placeholder:text-gray-400"
                    placeholder="e.g., I was stuck in traffic"
                  />
                  <button
                    type="button"
                    onClick={generateAlibi}
                    disabled={isGenerating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-xs font-bold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGenerating ? 'Thinking...' : 'AI Alibi'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Who</label>
                  <input 
                    required
                    type="text" 
                    value={formData.who}
                    onChange={e => setFormData({...formData, who: e.target.value})}
                    className="bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Who did you tell?"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">What</label>
                  <input 
                    required
                    type="text" 
                    value={formData.what}
                    onChange={e => setFormData({...formData, what: e.target.value})}
                    className="bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="What was it about?"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Where</label>
                  <input 
                    required
                    type="text" 
                    value={formData.where}
                    onChange={e => setFormData({...formData, where: e.target.value})}
                    className="bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Where were you?"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Why</label>
                  <input 
                    required
                    type="text" 
                    value={formData.why}
                    onChange={e => setFormData({...formData, why: e.target.value})}
                    className="bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Why did you lie?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Status</label>
                  <div className="flex bg-white/50 border border-orange-200 rounded-2xl p-1">
                    {(['active', 'safe', 'busted'] as Status[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status })}
                        className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${formData.status === status ? (status === 'safe' ? 'bg-green-500 text-white' : status === 'active' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white') : 'text-gray-500 hover:bg-white/50'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Expiration Date</label>
                  <input 
                    type="date" 
                    value={formData.expirationDate || ''}
                    onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                    className="bg-white/50 border border-orange-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all h-[54px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-orange-800/70 uppercase tracking-widest">Tags (Press Enter)</label>
                <div className="bg-white/50 border border-orange-200 rounded-2xl p-2 flex flex-wrap gap-2 focus-within:border-orange-500 focus-within:bg-white transition-all">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-xl text-sm font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none px-2 py-1.5 text-gray-900 placeholder:text-gray-400"
                    placeholder="Add a tag..."
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="mt-6 shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl py-4 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
              >
                {initialData ? 'Save Changes' : 'Store Lie'}
              </button>
            </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-orange-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white/95 backdrop-blur-3xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden text-center flex flex-col"
          >
            {/* macOS Controls */}
            <div className="flex items-center gap-2 px-6 pt-6 pb-0 relative z-20 shrink-0">
              <button type="button" onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center group transition-colors">
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button type="button" onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] flex items-center justify-center group transition-colors">
                <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button type="button" className="w-3.5 h-3.5 rounded-full bg-[#27c93f] flex items-center justify-center group transition-colors">
                <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
            </div>

            <div className="p-6 pt-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete this lie?</h3>
            <p className="text-gray-600 text-sm mb-6">This action cannot be undone. The truth might set you free, but this lie will be gone forever.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl py-3 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl py-3 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Delete
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Toast = ({ message, isVisible }: { message: string, isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-3xl border border-white/50 text-gray-900 px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(249,115,22,0.2)] flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-orange-500" />
          <span className="font-medium tracking-wide text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [lies, setLies] = useState<Lie[]>(initialLies);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLie, setEditingLie] = useState<Lie | null>(null);
  const [deletingLie, setDeletingLie] = useState<Lie | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

  // New features state
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [isIncognito, setIsIncognito] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const CORRECT_PIN = '1234'; // Hardcoded for demo

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      setIsLocked(false);
      setPinInput('');
    } else {
      showToast('Incorrect PIN');
      setPinInput('');
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSaveLie = (lieData: Omit<Lie, 'id' | 'date'>) => {
    if (editingLie) {
      setLies(lies.map(l => l.id === editingLie.id ? { ...l, ...lieData } : l));
      showToast('Lie successfully updated.');
    } else {
      const newLie: Lie = {
        ...lieData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      setLies([...lies, newLie]);
      showToast('New lie stored securely.');
    }
  };

  const handleDeleteLie = () => {
    if (deletingLie) {
      setLies(lies.filter(l => l.id !== deletingLie.id));
      setDeletingLie(null);
      showToast('Lie permanently deleted.');
    }
  };

  const openAddModal = () => {
    setEditingLie(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (lie: Lie) => {
    setEditingLie(lie);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (e: React.MouseEvent, lie: Lie) => {
    e.stopPropagation(); // Prevent opening edit modal
    setDeletingLie(lie);
  };

  const filteredAndSortedLies = lies
    .filter(lie => {
      // Month filter
      if (selectedMonth) {
        const lieMonth = new Date(lie.date).toLocaleString('default', { month: 'short' });
        if (lieMonth !== selectedMonth) return false;
      }
      
      // Search filter
      const query = searchQuery.toLowerCase();
      return (
        lie.name.toLowerCase().includes(query) ||
        lie.who.toLowerCase().includes(query) ||
        lie.what.toLowerCase().includes(query) ||
        lie.where.toLowerCase().includes(query) ||
        lie.why.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-gray-900 font-sans selection:bg-white/30 ${isIncognito ? 'blur-md transition-all duration-300' : 'transition-all duration-300'}`}>
      {isLocked && (
        <div className="fixed inset-0 z-[200] bg-orange-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 p-8 rounded-[2rem] border border-white/20 flex flex-col items-center max-w-sm w-full"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Vault Locked</h2>
            <p className="text-orange-200 text-sm text-center mb-8">Enter your PIN to access your lies.</p>
            
            <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
              <input 
                type="password" 
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-white/60"
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
              <button type="submit" className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors">
                Unlock
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white drop-shadow-md"
            >
              Liebook.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl font-medium tracking-tight drop-shadow-sm"
            >
              <span className="text-white font-bold">The truth is overrated.</span>{' '}
              <span className="text-orange-100">Store your best fictions here.</span>
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <button 
              onClick={() => setIsIncognito(!isIncognito)}
              className={`p-3 rounded-xl flex items-center gap-2 font-bold transition-all ${isIncognito ? 'bg-black text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              title="Incognito Mode (Blurs Screen)"
            >
              {isIncognito ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              <span className="hidden sm:inline">Incognito</span>
            </button>
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-3 rounded-xl flex items-center gap-2 font-bold transition-all ${showAnalytics ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button 
              onClick={() => setShowGraph(!showGraph)}
              className={`p-3 rounded-xl flex items-center gap-2 font-bold transition-all ${showGraph ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <Network className="w-5 h-5" />
              <span className="hidden sm:inline">Web of Lies</span>
            </button>
          </motion.div>
        </header>

        <AnimatePresence>
          {showAnalytics && <AnalyticsDashboard lies={lies} />}
        </AnimatePresence>

        <AnimatePresence>
          {showGraph && <WebOfLiesGraph lies={lies} />}
        </AnimatePresence>

        <OnThisDay lies={lies} />

        {/* Timeline Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Timeline selectedMonth={selectedMonth} onMonthSelect={setSelectedMonth} />
        </motion.div>

        {/* Controls Section (Search & Sort) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 mb-4 items-center justify-between"
        >
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Search lies, people, places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl pl-11 pr-4 py-3 text-gray-900 focus:outline-none focus:border-white focus:bg-white/90 transition-all placeholder:text-gray-600 shadow-sm"
            />
          </div>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/80 rounded-2xl px-5 py-3 text-gray-900 transition-all w-full sm:w-auto justify-center shadow-sm"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-600" />
            <span className="font-medium">
              Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </span>
          </button>
        </motion.div>

        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedLies.map((lie) => (
              <motion.div
                key={lie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <LieCard 
                  lie={lie} 
                  onEdit={() => openEditModal(lie)} 
                  onDelete={(e) => openDeleteModal(e, lie)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div layout>
            <AddCard onClick={openAddModal} />
          </motion.div>
        </div>

      </div>

      <LieFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveLie}
        initialData={editingLie}
      />

      <ConfirmDeleteModal
        isOpen={deletingLie !== null}
        onClose={() => setDeletingLie(null)}
        onConfirm={handleDeleteLie}
      />

      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
