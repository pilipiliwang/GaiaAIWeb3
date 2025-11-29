import { useGaiaStore } from '@/lib/gaia-store';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, Share2, Download, Calendar, Database, Gift, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export function LifeformView() {
  const { agents, myAgentId, toggleAutoLife } = useGaiaStore();
  const agent = agents.find(a => a.id === myAgentId);

  if (!agent) return null;

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4 overflow-y-auto pb-24 bg-slate-50">
      {/* Hero Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden relative group bg-white shadow-xl border border-white"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-50" />
        
        {/* Rarity Badge */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider border border-yellow-200">
          {agent.rarity}
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative w-48 h-48 mb-6 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-blue-200 blur-3xl rounded-full opacity-30" />
            <div className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10 bg-white">
              {agent.avatarUrl ? (
                <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-200">
                  {agent.name[0]}
                </div>
              )}
            </div>
            
            {/* Level Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              Level 1
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">{agent.name}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">{agent.personality} Companion</p>

          {/* Quick Stats */}
          <div className="flex gap-8 mt-6 text-center w-full justify-center pb-2">
            <div>
              <div className="text-xl font-bold text-slate-900">12</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">5</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Friends</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">3</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badges</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Auto-Life Toggle - Above tabs for global control */}
      <div className="max-w-sm mx-auto w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Auto-Life</h4>
              <p className="text-[10px] text-white/70 font-medium">Full autonomous mode</p>
            </div>
          </div>
          <Switch 
            checked={agent.autoLifeEnabled} 
            onCheckedChange={(checked) => toggleAutoLife(checked)}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
          />
        </div>
      </div>

      {/* Main Panel */}
      <div className="max-w-sm mx-auto w-full bg-white rounded-3xl shadow-lg border border-slate-100">
        <Tabs defaultValue="thoughts" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-slate-50 p-1.5 mx-2 mt-2 rounded-2xl" style={{ width: 'calc(100% - 16px)' }}>
            <TabsTrigger value="thoughts" className="rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-1">THOUGHTS</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-1">STATS</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-1">SKILLS</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-1">ITEMS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="thoughts" className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-800">Recent Memories</h3>
              </div>
              
              {agent.thoughts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No thoughts yet...</p>
                  <p className="text-xs mt-1">Interact with your companion to create memories!</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3 pr-2">
                    {agent.thoughts.map((thought, index) => (
                      <motion.div 
                        key={thought.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 relative"
                      >
                        <div className="absolute -left-1 top-4 w-2 h-2 rounded-full bg-purple-400" />
                        <p className="text-sm text-slate-700 font-medium leading-relaxed pl-2">
                          "{thought.text}"
                        </p>
                        <div className="text-[10px] text-purple-400 mt-2 pl-2 font-medium">
                          {new Date(thought.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(thought.timestamp).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="p-6 space-y-6">
            {/* Mood & Personality */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-slate-400">
                  <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> Happiness</span>
                  <span className="text-slate-700">{Math.round(agent.stats.happiness)}%</span>
                </div>
                <Progress value={agent.stats.happiness} className="h-2 bg-pink-100" indicatorClassName="bg-pink-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-slate-400">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Energy</span>
                  <span className="text-slate-700">{Math.round(agent.stats.energy)}%</span>
                </div>
                <Progress value={agent.stats.energy} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-slate-400">
                  <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-500 fill-blue-500" /> Friendship</span>
                  <span className="text-slate-700">{Math.round(agent.stats.friendship)}%</span>
                </div>
                <Progress value={agent.stats.friendship} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-slate-400">
                  <span className="flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500 fill-purple-500" /> Smarts</span>
                  <span className="text-slate-700">{Math.round(agent.stats.smarts)}%</span>
                </div>
                <Progress value={agent.stats.smarts} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
              </div>
            </div>

          </TabsContent>
          
          <TabsContent value="skills" className="p-6">
            <div className="space-y-3">
              {agent.skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{skill.name}</h4>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Lv {skill.level}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{skill.description}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full border-dashed border-slate-200 text-slate-400 text-xs h-12 hover:bg-slate-50 rounded-xl">
                 + Learn New Skill
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="p-6">
             <div className="grid grid-cols-4 gap-3">
               {agent.inventory.map(item => (
                 <div key={item.id} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-2 gap-1 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                   <span className="text-2xl">{item.icon}</span>
                   <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{item.name}</span>
                 </div>
               ))}
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="aspect-square rounded-xl bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center">
                   <span className="text-slate-300 text-xl">+</span>
                 </div>
               ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
