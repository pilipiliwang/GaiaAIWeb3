import { useGaiaStore } from '@/lib/gaia-store';
import { Globe, User, ArrowLeftRight } from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab } = useGaiaStore();

  const tabs = [
    { id: 'world', label: 'World', icon: Globe },
    { id: 'my_pet', label: 'NFT', icon: User },
    { id: 'shop', label: 'Exchange', icon: ArrowLeftRight },
  ] as const;

  return (
    <div className="h-20 bg-white/90 backdrop-blur-xl border-t border-blue-100 flex items-center justify-around px-6 pb-4 pt-2 relative z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex flex-col items-center justify-center gap-1
              transition-all duration-300 w-20
              ${isActive ? 'text-blue-600 -translate-y-2' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            <div className={`
              p-3 rounded-2xl transition-all duration-300
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-transparent'}
            `}>
              <Icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
