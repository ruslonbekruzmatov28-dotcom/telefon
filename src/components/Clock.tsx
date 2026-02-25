import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { RotateCcw, Settings2 } from 'lucide-react';

export const Clock: React.FC = () => {
  const [baseTime, setBaseTime] = useState(new Date());
  const [offsetMinutes, setOffsetMinutes] = useState(() => {
    const saved = localStorage.getItem('clock_offset');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [manualTime, setManualTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setBaseTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('clock_offset', offsetMinutes.toString());
  }, [offsetMinutes]);

  const displayTime = new Date(baseTime.getTime() + offsetMinutes * 60000);
  
  const seconds = displayTime.getSeconds();
  const minutes = displayTime.getMinutes();
  const hours = displayTime.getHours();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = manualTime.split(':');
    if (parts.length === 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60) {
        const now = new Date();
        const targetTotalMinutes = h * 60 + m;
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
        setOffsetMinutes(targetTotalMinutes - currentTotalMinutes);
        setIsEditing(false);
      }
    }
  };

  const secondsDegrees = (seconds / 60) * 360;
  const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hoursDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

  // Gesture handling for "Pro" adjustment
  const startY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isEditing) return;
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isEditing) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = startY.current - currentY;
    if (Math.abs(diff) > 10) {
      setOffsetMinutes(prev => prev + (diff > 0 ? 1 : -1));
      startY.current = currentY;
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full bg-black text-white p-2 overflow-hidden select-none"
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Analog Face */}
      <div className="relative w-32 h-32 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent opacity-50" />
        
        {/* Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 rounded-full ${i % 3 === 0 ? 'h-2.5 bg-blue-500' : 'h-1 bg-white/10'}`}
            style={{ transform: `rotate(${i * 30}deg) translateY(-58px)` }}
          />
        ))}

        {/* Hands */}
        <motion.div 
          className="absolute w-1 h-8 bg-white rounded-full origin-bottom z-20"
          animate={{ rotate: hoursDegrees }}
          transition={{ type: 'spring', stiffness: 50 }}
          style={{ translateY: '-16px' }}
        />
        <motion.div 
          className="absolute w-0.5 h-12 bg-white/40 rounded-full origin-bottom z-10"
          animate={{ rotate: minutesDegrees }}
          transition={{ type: 'spring', stiffness: 50 }}
          style={{ translateY: '-24px' }}
        />
        <motion.div 
          className="absolute w-px h-14 bg-blue-500 origin-bottom z-30"
          animate={{ rotate: secondsDegrees }}
          transition={{ type: 'tween', ease: 'linear', duration: 1 }}
          style={{ translateY: '-28px' }}
        />
        <div className="w-2 h-2 bg-white rounded-full z-40 border border-black" />
      </div>

      {/* Digital Display & "Pro" Controls */}
      <div className="mt-4 flex flex-col items-center w-full">
        {isEditing ? (
          <form onSubmit={handleManualSubmit} className="flex flex-col items-center">
            <input
              autoFocus
              type="text"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              placeholder={`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}
              className="bg-blue-600 text-white text-2xl font-mono font-bold tracking-tighter w-24 text-center rounded-2xl py-1 shadow-[0_0_20px_rgba(59,130,246,0.5)] focus:outline-none"
            />
            <button type="submit" className="hidden" />
          </form>
        ) : (
          <div 
            onClick={() => {
              setIsEditing(true);
              setManualTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            }}
            className="px-4 py-1 rounded-2xl bg-white/5 transition-all duration-300 cursor-pointer hover:bg-white/10"
          >
            <span className="text-2xl font-mono font-bold tracking-tighter">
              {hours.toString().padStart(2, '0')}:
              {minutes.toString().padStart(2, '0')}
            </span>
          </div>
        )}
        
        <div className="mt-2 flex items-center gap-3">
          {isEditing ? (
            <div className="text-[8px] uppercase font-black tracking-[0.2em] text-blue-400 animate-pulse">
              Enter bosing yoki suring
            </div>
          ) : (
            <div className="flex items-center gap-4 opacity-30">
              <button onClick={() => setIsEditing(true)} className="p-1"><Settings2 size={12} /></button>
              {offsetMinutes !== 0 && (
                <button onClick={() => setOffsetMinutes(0)} className="p-1"><RotateCcw size={12} /></button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




