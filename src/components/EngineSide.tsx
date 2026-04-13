import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPIC_LABELS, TOPIC_COLORS, TOPICS } from '../constants';
import type { Topic, ContentItem } from '../constants';
import type { ScoreBreakdown } from '../engine';

// --- PANEL A: User Vector ---
interface UserVectorPanelProps {
  userVector: number[];
}

const UserVectorPanel: React.FC<UserVectorPanelProps> = ({ userVector }) => {
  return (
    <div className="bg-engine-panel border border-engine-border rounded-lg p-4 h-full flex flex-col">
      <h4 className="font-mono text-[10px] text-algo-cyan uppercase tracking-widest mb-4">Your Preference Vector</h4>
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {TOPICS.map((topic, i) => (
          <div key={topic} className="flex items-center gap-3 font-mono text-[10px]">
            <span className="w-16 text-engine-dim truncate">{TOPIC_LABELS[topic]}</span>
            <div className="flex-1 h-3 bg-engine-black relative overflow-hidden rounded-full">
              <motion.div 
                initial={false}
                animate={{ 
                  width: `${Math.abs(userVector[i] * 100)}%`,
                  left: userVector[i] >= 0 ? '50%' : 'auto',
                  right: userVector[i] < 0 ? '50%' : 'auto',
                  backgroundColor: userVector[i] >= 0 ? TOPIC_COLORS[topic] : 'var(--color-algo-red)'
                }}
                className="absolute top-0 h-full"
              />
              <div className="absolute left-1/2 top-0 w-[1px] h-full bg-engine-faint" />
            </div>
            <span className="w-8 text-right text-engine-text">{(userVector[i]).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PANEL B: Content Scores ---
interface ContentScoresPanelProps {
  scoredContent: (ContentItem & { score: ScoreBreakdown })[];
  lastInteractedId?: number;
}

const ContentScoresPanel: React.FC<ContentScoresPanelProps> = ({ scoredContent, lastInteractedId }) => {
  return (
    <div className="bg-engine-panel border border-engine-border rounded-lg p-4 h-full flex flex-col">
      <h4 className="font-mono text-[10px] text-algo-green uppercase tracking-widest mb-4">Next Feed Calculation</h4>
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
        {scoredContent.map((item, idx) => {
          const isBuried = idx >= scoredContent.length / 2;
          const isInteracted = item.id === lastInteractedId;
          
          return (
            <motion.div 
              key={item.id}
              initial={false}
              animate={{ backgroundColor: isInteracted ? 'rgba(0, 230, 138, 0.1)' : 'transparent' }}
              className="font-mono text-[10px] border-b border-engine-border pb-2"
            >
              <div className="flex justify-between mb-1">
                <span className={isBuried ? 'text-algo-red' : 'text-algo-green'}>#{idx + 1} "{item.title.substring(0, 30)}..."</span>
                <span className="text-engine-faint">[{TOPIC_LABELS[item.topic]}]</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 text-engine-dim mb-1">
                <span>Rel: {item.score.relevance.toFixed(3)}</span>
                <span>Eng: {item.score.engagementPred.toFixed(3)}</span>
                <span>Rec: {item.score.recencyBoost >= 0 ? '+' : ''}{item.score.recencyBoost.toFixed(3)}</span>
                <span>Div: {item.score.diversityPenalty.toFixed(3)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-engine-text font-bold">SCORE: {item.score.finalScore.toFixed(3)}</span>
                <div className="flex-1 h-1.5 bg-engine-black rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isBuried ? 'bg-algo-red opacity-50' : 'bg-algo-green'}`} 
                    style={{ width: `${Math.min(100, item.score.finalScore * 100)}%` }} 
                  />
                </div>
                {isBuried && <span className="text-algo-red font-bold text-[8px]">BURIED</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- PANEL C: Embedding Space ---
// (Simplified 2D mapping for visualization)
const TOPIC_POSITIONS: Record<Topic, { x: number, y: number }> = {
  politics_left: { x: 20, y: 20 },
  politics_right: { x: 80, y: 20 },
  tech: { x: 50, y: 50 },
  science: { x: 50, y: 30 },
  sports: { x: 80, y: 80 },
  music: { x: 20, y: 80 },
  food: { x: 30, y: 50 },
  fashion: { x: 70, y: 50 },
  finance: { x: 80, y: 50 },
  memes: { x: 50, y: 80 },
};

interface EmbeddingSpacePanelProps {
  userVector: number[];
}

const EmbeddingSpacePanel: React.FC<EmbeddingSpacePanelProps> = ({ userVector }) => {
  const userPos = useMemo(() => {
    let x = 0, y = 0, totalWeight = 0;
    TOPICS.forEach((topic, i) => {
      const weight = Math.max(0, userVector[i]);
      x += TOPIC_POSITIONS[topic].x * weight;
      y += TOPIC_POSITIONS[topic].y * weight;
      totalWeight += weight;
    });
    
    if (totalWeight === 0) return { x: 50, y: 50 };
    return { x: x / totalWeight, y: y / totalWeight };
  }, [userVector]);

  return (
    <div className="bg-engine-panel border border-engine-border rounded-lg p-4 h-full flex flex-col">
      <h4 className="font-mono text-[10px] text-algo-cyan uppercase tracking-widest mb-4">Topic Embedding Map</h4>
      <div className="flex-1 bg-engine-black rounded border border-engine-border relative overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-5 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-white" />
          ))}
        </div>

        {/* Topic dots */}
        {TOPICS.map((topic) => (
          <div 
            key={topic}
            className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${TOPIC_POSITIONS[topic].x}%`, 
              top: `${TOPIC_POSITIONS[topic].y}%`,
              backgroundColor: TOPIC_COLORS[topic]
            }}
          >
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] text-engine-faint whitespace-nowrap">
              {TOPIC_LABELS[topic]}
            </span>
          </div>
        ))}

        {/* User dot */}
        <motion.div 
          animate={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="absolute inset-0 animate-ping bg-white rounded-full opacity-20" />
        </motion.div>
      </div>
    </div>
  );
};

// --- PANEL D: Bubble Monitor ---
interface BubbleMonitorPanelProps {
  bubbleScore: number;
}

const BubbleMonitorPanel: React.FC<BubbleMonitorPanelProps> = ({ bubbleScore }) => {
  const getStatusText = (score: number) => {
    if (score < 20) return { text: "DIVERSE", color: "text-algo-green" };
    if (score < 50) return { text: "NARROWING", color: "text-algo-amber" };
    if (score < 80) return { text: "ECHO CHAMBER FORMING", color: "text-algo-red" };
    return { text: "FULL FILTER BUBBLE", color: "text-algo-red animate-pulse" };
  };

  const status = getStatusText(bubbleScore);

  return (
    <div className="bg-engine-panel border border-engine-border rounded-lg p-4 h-full flex flex-col">
      <h4 className="font-mono text-[10px] text-engine-text uppercase tracking-widest mb-4">Filter Bubble Status</h4>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between mb-2">
          <span className={`font-mono text-xs font-bold ${status.color}`}>{status.text}</span>
          <span className="font-mono text-xs text-engine-text">{bubbleScore}%</span>
        </div>
        <div className="w-full h-4 bg-engine-black rounded-full overflow-hidden border border-engine-border p-[2px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${bubbleScore}%` }}
            className={`h-full rounded-full ${bubbleScore < 20 ? 'bg-algo-green' : bubbleScore < 50 ? 'bg-algo-amber' : 'bg-algo-red'}`}
          />
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] text-engine-faint uppercase font-mono mb-2">Network State</span>
            <div className="w-24 h-12 bg-engine-black rounded border border-engine-border relative overflow-hidden flex items-center justify-center group cursor-pointer">
              {/* Minimalist graph representation */}
              <div className="relative w-full h-full p-2 opacity-50">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 rounded-full bg-algo-cyan"
                    style={{ 
                      left: `${20 + Math.random() * 60}%`, 
                      top: `${20 + Math.random() * 60}%` 
                    }}
                  />
                ))}
              </div>
              <span className="absolute text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">Expand Graph</span>
            </div>
          </div>
          <div className="text-[10px] text-engine-dim font-mono max-w-[150px] leading-tight">
            Force-directed layout updating... User-content similarity clusters forming.
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN ENGINE SIDE COMPONENT ---
interface EngineSideProps {
  userVector: number[];
  scoredContent: (ContentItem & { score: ScoreBreakdown })[];
  bubbleScore: number;
  lastInteractedId?: number;
}

const EngineSide: React.FC<EngineSideProps> = ({ userVector, scoredContent, bubbleScore, lastInteractedId }) => {
  return (
    <div className="w-full h-full bg-engine-black p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto scrollbar-hide">
      <div className="h-[25vh]">
        <UserVectorPanel userVector={userVector} />
      </div>
      <div className="h-[40vh]">
        <ContentScoresPanel scoredContent={scoredContent} lastInteractedId={lastInteractedId} />
      </div>
      <div className="h-[25vh]">
        <EmbeddingSpacePanel userVector={userVector} />
      </div>
      <div className="h-[20vh]">
        <BubbleMonitorPanel bubbleScore={bubbleScore} />
      </div>
    </div>
  );
};

export default EngineSide;
