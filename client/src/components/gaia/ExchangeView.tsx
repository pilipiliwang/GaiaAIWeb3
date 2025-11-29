import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Lock, Search, Filter, Tag, Coins, Gem, Store, ArrowRightLeft, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGaiaStore } from '@/lib/gaia-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import charMax from '@assets/generated_images/cool_3d_robot_character_max.png';
import charNova from '@assets/generated_images/friendly_3d_creature_nova.png';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ExchangeView() {
  const { currency, buyItem, buyAgent, agents, myAgentId, shopHistory } = useGaiaStore();
  const myAgent = agents.find(a => a.id === myAgentId);

  const marketAgents = [
    {
      id: 'market-1',
      name: 'Cyber-X',
      price: 5000,
      rarity: 'EPIC',
      level: 12,
      image: charMax,
      dna: 'MKT-882'
    },
    {
      id: 'market-2',
      name: 'Puff',
      price: 2500,
      rarity: 'RARE',
      level: 5,
      image: charNova,
      dna: 'MKT-110'
    }
  ];

  const shopItems = [
    { id: 'food-1', name: 'Super Kibble', price: 50, type: 'Food', icon: '🍪' },
    { id: 'toy-1', name: 'Bouncy Ball', price: 120, type: 'Toy', icon: '🎾' },
    { id: 'decor-1', name: 'Cozy Bed', price: 500, type: 'Decor', icon: '🛏️' },
    { id: 'toy-2', name: 'Laser Pointer', price: 200, type: 'Toy', icon: '🔦' },
  ];

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col bg-slate-50">
      
      <div className="relative z-10 p-4 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <ArrowRightLeft className="w-6 h-6 text-blue-600" /> Exchange
          </h2>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-yellow-100 rounded-full text-yellow-700 text-xs font-bold flex items-center gap-1 border border-yellow-200">
              <span className="text-yellow-600">💰</span> {currency}
            </div>
          </div>
        </div>

        <Tabs defaultValue="agents" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-4 mb-4 bg-white border border-slate-100 p-1 h-12 rounded-xl shadow-sm shrink-0">
            <TabsTrigger value="agents" className="rounded-lg font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 text-xs sm:text-sm px-1">
              <Gem className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="rounded-lg font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 text-xs sm:text-sm px-1">
              <ShoppingBag className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="rounded-lg font-bold data-[state=active]:bg-green-50 data-[state=active]:text-green-600 text-xs sm:text-sm px-1">
              <Store className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Sell</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg font-bold data-[state=active]:bg-slate-100 data-[state=active]:text-slate-600 text-xs sm:text-sm px-1">
              <Receipt className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="flex-1 overflow-hidden">
             <ScrollArea className="h-full pb-20">
               <div className="grid grid-cols-1 gap-4 p-1">
                 {marketAgents.map((agent) => (
                   <div key={agent.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all">
                      <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                         <img src={agent.image} className="w-full h-full object-contain" alt={agent.name} />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                         <div className="flex justify-between items-start">
                            <div className="min-w-0">
                               <h3 className="font-bold text-lg text-slate-800 truncate">{agent.name}</h3>
                               <div className="text-xs text-slate-400 font-mono truncate">#{agent.dna}</div>
                            </div>
                            <span className={`
                               px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border shrink-0 ml-2
                               ${agent.rarity === 'EPIC' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-blue-100 text-blue-600 border-blue-200'}
                            `}>
                               {agent.rarity}
                            </span>
                         </div>
                         
                         <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="text-xs font-bold text-slate-500">Level {agent.level}</div>
                            <Button 
                              className="h-8 sm:h-9 bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-lg text-xs sm:text-sm"
                              onClick={() => buyAgent(agent as any)}
                            >
                               <Coins className="w-3 h-3 mr-1 text-yellow-400" /> {agent.price}
                            </Button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 <div className="p-6 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    New rare agents spawn in 12:45:00
                 </div>
               </div>
             </ScrollArea>
          </TabsContent>

          <TabsContent value="items" className="flex-1 overflow-hidden">
             <ScrollArea className="h-full pb-20">
               <div className="grid grid-cols-2 gap-3 p-1">
                 {shopItems.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-square rounded-xl bg-slate-50 flex items-center justify-center text-4xl mb-1">
                         {item.icon}
                      </div>
                      
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{item.type}</div>
                        <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="text-slate-900 font-bold text-sm flex items-center gap-1">
                          <span className="text-yellow-500">💰</span> {item.price}
                        </div>
                        <Button 
                          size="sm" 
                          className="h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold"
                          onClick={() => buyItem(item as any)}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                 ))}
               </div>
             </ScrollArea>
          </TabsContent>

          <TabsContent value="sell" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pb-20">
              <div className="flex flex-col gap-4 p-1">
                 <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                       <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold text-green-800">Market Trends</h3>
                       <p className="text-xs text-green-700/70 mt-1">Epic agents are up 15% today! It's a good time to sell high-level pets.</p>
                    </div>
                 </div>

                 <h3 className="font-bold text-slate-800 mt-2">My Inventory</h3>
                 
                 {myAgent && (
                   <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 opacity-50 grayscale">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                         {myAgent.avatarUrl && <img src={myAgent.avatarUrl} className="w-full h-full object-contain" />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between">
                           <h4 className="font-bold text-slate-800">{myAgent.name} (Active)</h4>
                           <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">Equipped</span>
                         </div>
                         <p className="text-xs text-slate-400 mt-1">Cannot sell active companion.</p>
                      </div>
                   </div>
                 )}

                 <div className="text-center py-10 text-slate-400 text-sm">
                    No other tradeable items found.
                 </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden">
             <ScrollArea className="h-full pb-20">
               <div className="space-y-2 p-1">
                 {shopHistory.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                       No transactions yet.
                    </div>
                 ) : (
                    shopHistory.map((record) => (
                       <div key={record.id} className="bg-white border border-slate-100 p-3 rounded-xl flex justify-between items-center">
                          <div>
                             <div className="font-bold text-slate-700 text-sm">{record.itemName}</div>
                             <div className="text-[10px] text-slate-400">
                                {new Date(record.timestamp).toLocaleString()}
                             </div>
                          </div>
                          <div className="text-red-500 font-bold text-xs">
                             -{record.cost} 💰
                          </div>
                       </div>
                    ))
                 )}
               </div>
             </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
