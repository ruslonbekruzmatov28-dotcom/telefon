import React, { useState, useEffect } from 'react';
import { Cloud, Calendar as CalendarIcon, Clock as ClockIcon, ListTodo, Home, Battery, Wifi, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Weather } from './components/Weather';
import { Calendar } from './components/Calendar';
import { Clock } from './components/Clock';
import { Todo } from './components/Todo';

type View = 'home' | 'weather' | 'calendar' | 'clock' | 'todo';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'weather': return <Weather />;
      case 'calendar': return <Calendar />;
      case 'clock': return <Clock />;
      case 'todo': return <Todo />;
      default: return (
        <div className="grid grid-cols-2 gap-2 p-2 h-full bg-black">
          <MenuButton icon={<Cloud size={28} />} label="Havo" color="from-blue-600 to-blue-400" onClick={() => setView('weather')} />
          <MenuButton icon={<CalendarIcon size={28} />} label="Sana" color="from-emerald-600 to-emerald-400" onClick={() => setView('calendar')} />
          <MenuButton icon={<ClockIcon size={28} />} label="Vaqt" color="from-purple-600 to-purple-400" onClick={() => setView('clock')} />
          <MenuButton icon={<ListTodo size={28} />} label="Ishlar" color="from-orange-600 to-orange-400" onClick={() => setView('todo')} />
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-sans">
      {/* Exact 240x320 Screen Container */}
      <div className="relative w-[240px] h-[320px] bg-black overflow-hidden border border-white/5 shadow-2xl">
        
        {/* Status Bar */}
        <div className="h-6 bg-black/90 backdrop-blur-md flex items-center justify-between px-3 text-[9px] text-white/80 font-medium z-50 border-bottom border-white/5">
          <span className="font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="flex items-center gap-1.5">
            <Wifi size={10} className="text-white/40" />
            <div className="flex items-center gap-0.5">
              <Battery size={10} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Main Content Area - Adjusted height for 240x320 */}
        <div className="h-[254px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Bar - Optimized for 240px width touch */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50">
          <NavIcon active={view === 'home'} icon={<Home size={20} />} onClick={() => setView('home')} />
          <NavIcon active={view === 'weather'} icon={<Cloud size={20} />} onClick={() => setView('weather')} />
          <NavIcon active={view === 'calendar'} icon={<CalendarIcon size={20} />} onClick={() => setView('calendar')} />
          <NavIcon active={view === 'todo'} icon={<ListTodo size={20} />} onClick={() => setView('todo')} />
        </div>
      </div>
    </div>
  );
}

function NavIcon({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-xl transition-all duration-300 ${active ? 'text-blue-400 scale-110' : 'text-white/30 hover:text-white/60'}`}
    >
      {icon}
      {active && <motion.div layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />}
    </button>
  );
}

function MenuButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${color} text-white rounded-[24px] flex flex-col items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.3)] active:scale-90 transition-all duration-300 group relative overflow-hidden border border-white/10`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50" />
      <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-xl border border-white/20 z-10 shadow-inner">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-90 z-10 drop-shadow-md">{label}</span>
    </button>
  );
}

