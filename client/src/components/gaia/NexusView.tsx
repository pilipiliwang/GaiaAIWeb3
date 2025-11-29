import { useGaiaStore } from '@/lib/gaia-store';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Users, Gift, Zap, Heart, Sparkles, PlayCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { WorldMap } from '@/components/gaia/WorldMap';
import { GlobalLog } from '@/components/gaia/GlobalLog';
import { AgentInspector } from '@/components/gaia/AgentInspector';

export function NexusView() {
  const { startQuest, activeQuest, myAgentId, agents } = useGaiaStore();
  const isQuesting = activeQuest?.status === 'active';
  const myAgent = agents.find(a => a.id === myAgentId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4 overflow-y-auto md:overflow-hidden bg-slate-50 relative">
      {/* Map Section - Expands when questing */}
      <div className={`
        relative overflow-hidden border-4 border-white shadow-xl flex flex-col
        transition-all duration-500 ease-in-out shrink-0
        ${isQuesting 
          ? 'fixed inset-0 z-[100] m-0 rounded-none border-0 bg-[#87CEEB]' 
          : 'h-[400px] md:h-auto md:flex-1 rounded-3xl bg-blue-200'}
      `}>
        <WorldMap />
        
        {/* Floating Log */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none [&>*]:pointer-events-auto">
          <GlobalLog />
        </div>

        {/* Live Thoughts Bubble (World View) */}
        {myAgent && myAgent.thoughts.length > 0 && (
           <motion.div 
             key={myAgent.thoughts[0].id}
             initial={{ opacity: 0, y: 20, scale: 0.8 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             className="absolute top-20 right-4 z-20 max-w-[200px]"
           >
             <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl rounded-tr-none shadow-lg border border-blue-100 relative">
               <div className="flex items-center gap-2 mb-1">
                 <MessageSquare className="w-3 h-3 text-blue-400" />
                 <span className="text-[10px] font-bold text-blue-500 uppercase">Current Thought</span>
               </div>
               <p className="text-xs text-slate-700 font-medium leading-relaxed">
                 "{myAgent.thoughts[0].text}"
               </p>
               {/* Triangle pointer */}
               <div className="absolute -right-2 top-0 w-0 h-0 border-t-[10px] border-t-white/90 border-r-[10px] border-r-transparent transform rotate-0" />
             </div>
           </motion.div>
        )}

        {/* Explorer Overlay (Active Quest) */}
        <AnimatePresence>
          {isQuesting && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md text-white p-6 z-40 border-t border-white/10"
            >
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                     <Search className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                     <div className="font-bold text-lg">Exploration Mode Active</div>
                     <div className="text-xs text-slate-400">Scanning for hidden signals...</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-3xl font-mono font-bold text-yellow-400">{Math.round(activeQuest.progress)}%</div>
                   <div className="text-[10px] uppercase tracking-widest text-slate-500">Progress</div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel - Inspector & Actions - Hidden when questing */}
      <div className={`
        w-full md:w-[380px] flex-shrink-0 flex flex-col gap-4 min-h-0 transition-all duration-500
        ${isQuesting ? 'opacity-0 pointer-events-none w-0 hidden' : 'opacity-100'}
        h-auto md:h-full
      `}>
        
        {/* Inspector (Top half of right panel on desktop) */}
        <div className="h-[500px] md:h-auto md:flex-1 min-h-0 overflow-hidden rounded-xl shrink-0">
          <AgentInspector />
        </div>

        {/* Daily Quests Card (Bottom half) */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-lg border border-blue-100 shrink-0">
          <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-400" /> Daily Fun
          </h3>
          
          <div className="space-y-2 md:space-y-3">
             <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                 <Search className="w-5 h-5" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-bold text-slate-700 truncate">Explorer</div>
                 <div className="text-xs text-slate-400 truncate">Find a hidden item</div>
               </div>
               
               {activeQuest ? (
                 <Button size="sm" disabled className="h-8 bg-slate-100 text-slate-400 font-bold rounded-lg">
                   Running...
                 </Button>
               ) : (
                 <Button 
                   size="sm" 
                   className="h-8 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-blue-200 shadow-md"
                   onClick={() => startQuest('daily-explore')}
                 >
                   <PlayCircle className="w-4 h-4 mr-1" /> Go!
                 </Button>
               )}
             </div>
             
             <div className="p-3 rounded-xl bg-pink-50 border border-pink-100 flex items-center gap-3 opacity-60">
               <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
                 <Users className="w-5 h-5" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-bold text-slate-700 truncate">Make Friends</div>
                 <div className="text-xs text-slate-400 truncate">Say hi to 3 pets</div>
               </div>
               <span className="text-xs font-bold text-pink-400 bg-pink-100 px-2 py-1 rounded">0/3</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
