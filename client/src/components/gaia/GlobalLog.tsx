import { useGaiaStore } from '@/lib/gaia-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalLog() {
  const { logs } = useGaiaStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollable = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollable) {
        scrollable.scrollTop = scrollable.scrollHeight;
      }
    }
  }, [logs, isExpanded]);

  return (
    <div className="flex flex-col items-start">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-md shadow-lg border border-white/50 rounded-full px-3 py-2 flex items-center gap-2 hover:bg-white transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <Bell className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Updates</span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-[260px] sm:w-[280px] bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl flex flex-col overflow-hidden shadow-xl"
          >
            <div 
              className="h-8 bg-white/50 border-b border-slate-100 flex items-center justify-between px-3 cursor-pointer hover:bg-white/60 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Updates</span>
              </div>
              <ChevronUp className="w-3 h-3 text-slate-400" />
            </div>
            
            <div className="h-32 sm:h-40 bg-white/40">
              <ScrollArea ref={scrollRef} className="h-full w-full p-3">
                <div className="space-y-2 pb-2">
                  {logs.slice().reverse().map((log) => (
                    <div key={log.id} className="text-xs flex gap-2 items-start">
                      <span className="text-slate-400 font-mono text-[10px] mt-0.5 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`
                        font-medium leading-tight
                        ${log.type === 'growth' ? 'text-green-600' : ''}
                        ${log.type === 'fun' ? 'text-pink-500' : ''}
                        ${log.type === 'reward' ? 'text-yellow-600' : ''}
                        ${log.type === 'info' ? 'text-slate-600' : ''}
                      `}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
