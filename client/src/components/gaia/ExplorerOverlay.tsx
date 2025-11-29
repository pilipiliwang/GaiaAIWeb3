import { useGaiaStore } from '@/lib/gaia-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gift, Zap, MapPin, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import bgImage from '@assets/generated_images/isometric_3d_training_park.png';

const MAP_SIZE = 800;

export function ExplorerOverlay() {
  const { 
    agents, 
    activeQuest, 
    myAgentId, 
    mapNodes, 
    collectNode,
    completeQuest,
    selectedAgentId,
    setSelectedAgent
  } = useGaiaStore();
  
  const isActive = activeQuest?.status === 'active';
  const myAgent = agents.find(a => a.id === myAgentId);

  if (!isActive || !myAgent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ height: '100vh', width: '100vw' }}
        data-testid="explorer-overlay"
      >
        {/* Full-screen Map Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: '#87CEEB',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={() => setSelectedAgent(null)}
        >
          {/* Map Nodes (Collectibles) */}
          <AnimatePresence>
            {mapNodes.map((node) => (
              !node.collected && (
                <motion.button
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute w-10 h-10 -ml-5 -mt-5 z-20 cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    left: `${(node.x / MAP_SIZE) * 100}%`,
                    top: `${(node.y / MAP_SIZE) * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    collectNode(node.id);
                  }}
                  data-testid={`node-${node.type}-${node.id}`}
                >
                  {node.type === 'treasure' ? (
                    <div className="w-full h-full bg-yellow-400 rounded-lg border-2 border-yellow-600 shadow-lg flex items-center justify-center animate-bounce">
                      <Gift className="w-5 h-5 text-yellow-900" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-blue-400 rounded-full border-2 border-blue-600 shadow-lg flex items-center justify-center animate-pulse">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.button>
              )
            ))}
          </AnimatePresence>

          {/* Agents on Map */}
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            const isMyAgent = agent.id === myAgentId;
            
            return (
              <motion.div
                key={agent.id}
                className="absolute w-20 h-20 -ml-10 -mt-16 flex flex-col items-center justify-center cursor-pointer z-10"
                animate={{
                  left: `${(agent.position.x / MAP_SIZE) * 100}%`,
                  top: `${(agent.position.y / MAP_SIZE) * 100}%`,
                  zIndex: Math.floor(agent.position.y)
                }}
                transition={{ 
                  type: "tween", 
                  duration: 0.5, 
                  ease: "linear" 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgent(agent.id);
                }}
              >
                {/* Quest Indicator for user's agent */}
                {isMyAgent && (
                  <motion.div 
                    className="absolute -top-8 text-3xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    🗺️
                  </motion.div>
                )}

                {/* Agent Body */}
                <div className={`
                  relative transition-transform duration-200
                  ${isSelected ? 'scale-110' : 'hover:scale-105'}
                  ${isMyAgent ? 'ring-4 ring-yellow-400 ring-offset-2 rounded-full' : ''}
                `}>
                  {/* Shadow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/20 rounded-[100%] blur-sm" />
                  
                  {/* Character Sprite */}
                  <div className={`
                    w-20 h-20 relative z-10 drop-shadow-lg
                    ${isSelected ? 'brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}
                  `}>
                    {agent.avatarUrl ? (
                      <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-200" style={{ backgroundColor: agent.color }} />
                    )}
                  </div>
                </div>

                {/* Name Tag */}
                <div className={`
                  mt-1 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md
                  ${isMyAgent ? 'bg-yellow-400 text-yellow-900' : 'bg-black/40 text-white'}
                `}>
                  {agent.name}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 z-30 p-4"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Quest Title */}
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Exploration Mode</div>
                <div className="text-xs text-slate-500">Find hidden treasures!</div>
              </div>
            </div>

            {/* Exit Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => completeQuest()}
              className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md border-white/50 shadow-lg hover:bg-red-50"
              data-testid="button-exit-explorer"
            >
              <X className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </motion.div>

        {/* Bottom Progress Panel */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 z-30"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-6 border-t border-white/10">
            <div className="max-w-2xl mx-auto">
              {/* Progress Bar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Discovery Progress</span>
                    <span className="text-sm font-bold text-yellow-400">{Math.round(activeQuest.progress)}%</span>
                  </div>
                  <Progress value={activeQuest.progress} className="h-3 bg-slate-700" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {mapNodes.filter(n => n.collected).length} / {mapNodes.length} collected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">+{activeQuest.reward} coins reward</span>
                  </div>
                </div>

                {/* Complete Button (shows when ready) */}
                {activeQuest.progress >= 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Button
                      onClick={() => completeQuest()}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 rounded-xl shadow-lg"
                      data-testid="button-complete-quest"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Claim Reward!
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-yellow-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-slate-700">Tap the glowing items to collect them!</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
