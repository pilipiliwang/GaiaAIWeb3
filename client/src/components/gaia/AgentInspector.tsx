import { useGaiaStore } from '@/lib/gaia-store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Sparkles, MessageSquare, Activity, Zap, Brain, Cloud, UserPlus, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AgentInspector() {
  const { agents, selectedAgentId, interactWithAgent, myAgentId } = useGaiaStore();

  const agent = agents.find(a => a.id === selectedAgentId);
  const isMyAgent = agent?.id === myAgentId;

  if (!agent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center border-l border-border/50 bg-white/80 backdrop-blur-sm rounded-xl">
        <Sparkles className="w-12 h-12 mb-4 opacity-20 text-blue-400" />
        <h3 className="text-lg font-bold mb-2 text-blue-900">Who to play with?</h3>
        <p className="text-sm text-blue-700/50">Tap on a friend in the park!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-md border-l border-blue-100 overflow-y-auto rounded-xl shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-blue-50 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 shrink-0">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <Activity className="w-24 h-24 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div 
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-white overflow-hidden"
          >
            {agent.avatarUrl ? (
              <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-contain" />
            ) : (
              <span style={{ color: agent.color }} className="text-2xl font-bold">{agent.name[0]}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900">{agent.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold border border-blue-200">
                {agent.personality}
              </span>
              {!isMyAgent && (
                 <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold border border-green-200 flex items-center gap-1">
                   <MessageSquare className="w-3 h-3" /> Friend
                 </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-blue-400 font-bold">
            <span className="flex items-center gap-2"><Heart className="w-4 h-4 fill-pink-400 text-pink-400" /> Happiness</span>
            <span className="text-pink-500">{Math.round(agent.stats.happiness)}%</span>
          </div>
          <Progress value={agent.stats.happiness} className="h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-400 to-rose-500" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-blue-400 font-bold">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Energy</span>
            <span className="text-yellow-600">{Math.round(agent.stats.energy)}%</span>
          </div>
          <Progress value={agent.stats.energy} className="h-2 bg-yellow-100" indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-blue-400 font-bold">
            <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 fill-blue-400 text-blue-400" /> Friendship</span>
            <span className="text-blue-600">{Math.round(agent.stats.friendship)}%</span>
          </div>
          <Progress value={agent.stats.friendship} className="h-2 bg-blue-100" indicatorClassName="bg-gradient-to-r from-blue-400 to-cyan-500" />
        </div>
      </div>

      {/* Interactions */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2 shrink-0">
        {isMyAgent ? (
          <>
            <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-pink-200 bg-pink-50 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300 transition-all rounded-xl"
              onClick={() => interactWithAgent(agent.id, 'play')}
            >
              <span className="text-lg">🎾</span>
              <span className="text-[10px] font-bold text-pink-500">Play</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-300 transition-all rounded-xl"
              onClick={() => interactWithAgent(agent.id, 'feed')}
            >
              <span className="text-lg">🍪</span>
              <span className="text-[10px] font-bold text-orange-500">Feed</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all rounded-xl"
              onClick={() => interactWithAgent(agent.id, 'pet')}
            >
              <span className="text-lg">✨</span>
              <span className="text-[10px] font-bold text-blue-500">Pet</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-600 hover:border-purple-300 transition-all rounded-xl"
              onClick={() => interactWithAgent(agent.id, 'teach')}
            >
              <span className="text-lg">📚</span>
              <span className="text-[10px] font-bold text-purple-500">Teach</span>
            </Button>
          </>
        ) : (
          <>
             <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-600 hover:border-green-300 transition-all rounded-xl col-span-2"
              onClick={() => interactWithAgent(agent.id, 'play')}
            >
              <Hand className="w-4 h-4" />
              <span className="text-[10px] font-bold text-green-600">Wave Hello</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex flex-col gap-0.5 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all rounded-xl col-span-2"
              onClick={() => interactWithAgent(agent.id, 'pet')}
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-[10px] font-bold text-blue-600">Add Friend</span>
            </Button>
          </>
        )}
      </div>

      {/* Thoughts Stream */}
      <div className="bg-blue-50/50 border-t border-blue-100 shrink-0">
        <div className="px-4 py-2 bg-blue-50/80 flex items-center gap-2 text-xs font-bold uppercase text-blue-400 tracking-wider">
          <Cloud className="w-4 h-4" /> Thoughts
        </div>
        <div className="p-3 max-h-[120px] overflow-y-auto">
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {agent.thoughts.slice(0, 3).map((thought) => (
                <motion.div 
                  key={thought.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-2 rounded-xl rounded-tl-none shadow-sm text-xs border border-blue-100 ml-2"
                >
                  <p className="text-slate-600 leading-relaxed">
                    {thought.text}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                    {new Date(thought.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
