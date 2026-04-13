import React from 'react';
import type { Topic } from '../constants';

interface NavigationProps {
  interactionCount: number;
  bubbleScore: number;
  diversityMode: boolean;
  onToggleDiversity: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  interactionCount, 
  bubbleScore, 
  diversityMode, 
  onToggleDiversity 
}) => {
  const getBubbleColor = (score: number) => {
    if (score < 20) return 'text-algo-green';
    if (score < 50) return 'text-algo-amber';
    return 'text-algo-red';
  };

  return (
    <nav className="w-full bg-engine-black text-white h-16 flex items-center justify-between px-8 border-b-2 border-transparent relative overflow-hidden">
      {/* Background gradient border effect */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-feed-blue via-algo-green to-algo-cyan" />
      
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-algo-green tracking-tight">AlgoLens</h1>
      </div>

      <div className="flex items-center gap-12 font-mono text-sm">
        <div className="flex flex-col items-center">
          <span className="text-engine-faint text-[10px] uppercase tracking-widest">Interactions</span>
          <span className="text-algo-cyan">{interactionCount}/30</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-engine-faint text-[10px] uppercase tracking-widest">Bubble Score</span>
          <span className={`${getBubbleColor(bubbleScore)} font-bold tracking-tighter`}>{bubbleScore}%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase tracking-widest font-mono ${diversityMode ? 'text-algo-purple' : 'text-engine-faint'}`}>
            Diversity Mode: {diversityMode ? 'ON' : 'OFF'}
          </span>
          <button 
            onClick={onToggleDiversity}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${diversityMode ? 'bg-algo-purple' : 'bg-engine-faint'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${diversityMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
