import { useState } from 'react';
import { useGaiaStore, AgentPersonality } from '@/lib/gaia-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Loader2 } from 'lucide-react';

export function Onboarding() {
  const { createMyAgent } = useGaiaStore();
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState<AgentPersonality>('Playful');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const trimmedName = name.trim();
  const isValidName = trimmedName.length >= 2 && trimmedName.length <= 20;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
  };

  const handleNextStep = () => {
    if (!trimmedName) {
      setError('Please enter a name for your companion');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    setStep(2);
  };

  const handleCreate = async () => {
    if (!isValidName || isCreating) return;
    
    setIsCreating(true);
    setError('');
    
    try {
      await createMyAgent(trimmedName, personality);
    } catch (err) {
      setError('Failed to create companion. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen fixed inset-0 z-50 w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white" />
      
      {/* Floating Circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 rotate-3"
          >
            <Sparkles className="w-12 h-12 text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Gaia World</h1>
          <p className="text-slate-500 text-lg">Create your digital companion</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 space-y-6 shadow-2xl">
          {step === 1 ? (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Name your friend</label>
                <Input 
                  placeholder="e.g. Sparky" 
                  className={`bg-slate-50 text-xl font-bold h-14 focus:border-blue-500 focus:ring-blue-200 rounded-xl ${error ? 'border-red-300' : 'border-slate-200'}`}
                  value={name}
                  onChange={handleNameChange}
                  maxLength={20}
                  data-testid="input-agent-name"
                />
                {error && (
                  <p className="text-red-500 text-xs font-medium" data-testid="text-error">{error}</p>
                )}
                <p className="text-slate-400 text-xs">{trimmedName.length}/20 characters</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Personality</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Playful', 'Calm', 'Energetic', 'Clever'] as AgentPersonality[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPersonality(p)}
                      className={`
                        p-4 rounded-xl border text-sm font-bold transition-all
                        ${personality === p 
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 transform scale-105' 
                          : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl mt-4 shadow-xl"
                onClick={handleNextStep}
                disabled={!trimmedName}
                data-testid="button-next"
              >
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-8 text-center py-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 blur-2xl opacity-20 rounded-full" />
                <Heart className="w-16 h-16 mx-auto text-pink-500 animate-bounce relative z-10" fill="currentColor" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Bringing {name} to life...</h3>
                <p className="text-slate-500 mt-2">Generating unique DNA sequence</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-left space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">TRAIT:</span>
                  <span className="text-blue-600 font-bold">{personality.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DNA:</span>
                  <span className="text-slate-600 truncate w-32">{Math.random().toString(36).substring(2)}...</span>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium text-center" data-testid="text-create-error">{error}</p>
              )}

              <Button 
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-200 rounded-xl disabled:opacity-50"
                onClick={handleCreate}
                disabled={isCreating}
                data-testid="button-create"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" /> Start Adventure
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
