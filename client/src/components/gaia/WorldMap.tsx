import { useEffect, useRef } from 'react';
import { useGaiaStore } from '@/lib/gaia-store';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '@assets/generated_images/isometric_3d_training_park.png';
import { Gift, Zap } from 'lucide-react';

export function WorldMap() {
  const { agents, selectedAgentId, setSelectedAgent, mapNodes, collectNode, activeQuest } = useGaiaStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const MAP_SIZE = 800;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-xl shadow-inner group select-none"
      style={{
        backgroundColor: '#87CEEB',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100%',
      }}
      onClick={() => setSelectedAgent(null)}
    >
      {/* Quest Overlay */}
      <AnimatePresence>
        {activeQuest && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-yellow-400 flex items-center gap-3"
          >
             <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
             <div className="text-xs font-bold text-slate-800">
               Mission in progress: {Math.round(activeQuest.progress)}%
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Nodes (Treasures) */}
      <AnimatePresence>
        {mapNodes.map((node) => (
          !node.collected && (
            <motion.button
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute w-8 h-8 -ml-4 -mt-4 z-20 cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: `${(node.x / MAP_SIZE) * 100}%`,
                top: `${(node.y / MAP_SIZE) * 100}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                collectNode(node.id);
              }}
            >
              {node.type === 'treasure' ? (
                 <div className="w-full h-full bg-yellow-400 rounded-lg border-2 border-yellow-600 shadow-lg flex items-center justify-center animate-bounce">
                   <Gift className="w-4 h-4 text-yellow-900" />
                 </div>
              ) : (
                 <div className="w-full h-full bg-blue-400 rounded-full border-2 border-blue-600 shadow-lg flex items-center justify-center animate-pulse">
                   <Zap className="w-4 h-4 text-white" />
                 </div>
              )}
            </motion.button>
          )
        ))}
      </AnimatePresence>

      {/* Agents */}
      {agents.map((agent) => {
        const isSelected = selectedAgentId === agent.id;
        
        return (
          <motion.div
            key={agent.id}
            className="absolute w-16 h-16 -ml-8 -mt-12 flex flex-col items-center justify-center cursor-pointer z-10"
            animate={{
              left: `${(agent.position.x / MAP_SIZE) * 100}%`,
              top: `${(agent.position.y / MAP_SIZE) * 100}%`,
              zIndex: Math.floor(agent.position.y) // Simple depth sorting
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
            {/* Speech Bubble */}
            {agent.currentAction === 'chatting' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="absolute -top-8 bg-white text-black text-[10px] px-3 py-1.5 rounded-2xl shadow-lg whitespace-nowrap font-bold border-2 border-black/5"
              >
                💬 Hi!
              </motion.div>
            )}
            
            {/* Quest Indicator */}
            {agent.currentAction === 'questing' && (
              <motion.div 
                className="absolute -top-10 text-2xl animate-bounce"
              >
                🗺️
              </motion.div>
            )}

            {/* Agent Body */}
            <div className={`
              relative transition-transform duration-200
              ${isSelected ? 'scale-110' : 'hover:scale-105'}
            `}>
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 rounded-[100%] blur-sm" />
              
              {/* 3D Character Sprite */}
              <div 
                className={`
                  w-16 h-16 relative z-10 drop-shadow-lg
                  ${isSelected ? 'filter brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}
                `}
              >
                 {agent.avatarUrl ? (
                   <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-contain" />
                 ) : (
                   // Fallback primitive
                   <div className="w-10 h-10 rounded-full bg-white border-4 border-gray-200" style={{ backgroundColor: agent.color }} />
                 )}
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-white bg-primary rounded-full animate-bounce" />
              )}
            </div>

            {/* Name Tag */}
            <div className="mt-1 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
              {agent.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
