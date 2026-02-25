import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayLabels, setDayLabels] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar_events');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [labelInput, setLabelInput] = useState("");

  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(dayLabels));
  }, [dayLabels]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setLabelInput(dayLabels[format(day, 'yyyy-MM-dd')] || "");
  };

  const saveLabel = () => {
    if (selectedDay) {
      const key = format(selectedDay, 'yyyy-MM-dd');
      if (labelInput.trim()) {
        setDayLabels(prev => ({ ...prev, [key]: labelInput }));
      } else {
        const newLabels = { ...dayLabels };
        delete newLabels[key];
        setDayLabels(newLabels);
      }
      setSelectedDay(null);
    }
  };

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  
  // Logic to find the next upcoming event if today is empty
  const getPreviewEvent = () => {
    if (dayLabels[todayKey]) return { text: dayLabels[todayKey], label: "Bugun" };
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = format(tomorrow, 'yyyy-MM-dd');
    if (dayLabels[tomorrowKey]) return { text: dayLabels[tomorrowKey], label: "Ertaga" };

    // Find the soonest event in the future
    const futureEvents = Object.keys(dayLabels)
      .filter(key => key > todayKey)
      .sort();
    
    if (futureEvents.length > 0) {
      const nextKey = futureEvents[0];
      const nextDate = new Date(nextKey);
      return { 
        text: dayLabels[nextKey], 
        label: format(nextDate, 'd-MMM') 
      };
    }

    return null;
  };

  const preview = getPreviewEvent();

  return (
    <div className="flex flex-col h-full bg-black text-white p-2 relative overflow-hidden">
      {/* Top Event Preview Bar - Shows Today or Next Upcoming */}
      <div className="h-8 mb-2 flex items-center px-2 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <Sparkles size={10} className="text-blue-400 mr-2 shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          {preview ? (
            <>
              <span className="text-[5px] uppercase tracking-[0.2em] text-blue-400/60 leading-none mb-0.5">{preview.label}</span>
              <div className="text-[8px] font-bold uppercase tracking-widest truncate leading-none">
                {preview.text}
              </div>
            </>
          ) : (
            <div className="text-[8px] font-bold uppercase tracking-widest truncate opacity-30">
              Rejalar yo'q
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1.5 bg-white/5 rounded-lg active:scale-90 transition-all"><ChevronLeft size={12} /></button>
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="flex flex-col items-center group active:scale-95 transition-all"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-white transition-colors">{format(currentDate, 'MMMM')}</h2>
          <span className="text-[6px] opacity-20 font-mono uppercase tracking-widest">{format(currentDate, 'yyyy')}</span>
        </button>
        <button onClick={nextMonth} className="p-1.5 bg-white/5 rounded-lg active:scale-90 transition-all"><ChevronRight size={12} /></button>
      </div>
      
      <div className="grid grid-cols-7 mb-1 border-b border-white/5 pb-1">
        {['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map((d, i) => (
          <div key={d} className={cn("text-[7px] font-bold text-center uppercase", i >= 5 ? "text-blue-400/40" : "opacity-20")}>{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden flex-1">
        {calendarDays.map((day, idx) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, monthStart);
          const label = dayLabels[format(day, 'yyyy-MM-dd')];

          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative h-full flex flex-col items-center justify-center text-[9px] transition-all cursor-pointer bg-black",
                !isCurrentMonth && "opacity-10",
                isToday && "bg-blue-600/20 text-blue-400 font-black z-10",
                isCurrentMonth && !isToday && "hover:bg-white/5",
                label && !isToday && "bg-blue-500/5"
              )}
            >
              <span className={cn(isToday && "scale-110")}>{format(day, 'd')}</span>
              {label && <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]" />}
              {isToday && <div className="absolute bottom-1 w-3 h-0.5 bg-blue-400 rounded-full" />}
            </motion.div>
          );
        })}
      </div>

      {/* Pro Editor Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-2 bg-[#0a0a0a] z-[100] rounded-2xl border border-white/10 p-4 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-[7px] uppercase tracking-widest opacity-40">Tadbir qo'shish</span>
                <h3 className="text-[10px] font-black uppercase text-blue-400">
                  {format(selectedDay, 'd MMMM')}
                </h3>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1 text-white/20"><X size={14} /></button>
            </div>
            
            <input
              autoFocus
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Nima reja?..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white mb-4 focus:outline-none focus:border-blue-500"
            />
            
            <button 
              onClick={saveLabel}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Saqlash
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};




