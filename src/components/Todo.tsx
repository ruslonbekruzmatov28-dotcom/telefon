import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Todo: React.FC = () => {
  const [todos, setTodos] = useState([{ id: 1, text: "Non olish", completed: false }]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([{ id: Date.now(), text: input, completed: false }, ...todos]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-black p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yangi vazifa..."
          className="flex-1 text-[11px] p-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-transform">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {todos.map(todo => (
            <motion.div 
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 group"
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1" onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))}>
                {todo.completed ? 
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" /> : 
                  <Circle size={16} className="text-white/20 shrink-0" />
                }
                <span className={`text-[11px] truncate font-medium ${todo.completed ? 'line-through text-white/20' : 'text-white/80'}`}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} 
                className="text-white/10 hover:text-red-500 transition-colors ml-2"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-20">
            <ListTodo size={32} className="mb-2" />
            <span className="text-[10px] uppercase tracking-widest">Ro'yxat bo'sh</span>
          </div>
        )}
      </div>
    </div>
  );
};

import { ListTodo } from 'lucide-react';

