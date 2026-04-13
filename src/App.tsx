import { useState, useCallback, useMemo } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FeedSide from './components/FeedSide';
import EngineSide from './components/EngineSide';
import Report from './components/Report';
import NetworkGraph from './components/NetworkGraph';
import { 
  contentDB, 
} from './constants';
import type { 
  ContentItem, 
  Topic, 
} from './constants';
import { 
  updateUserVector, 
  generateFeed, 
  calculateBubbleScore, 
  scoreContent
} from './engine';
import type {
  ScoreBreakdown, 
  InteractionType,
} from './engine';

type AppState = 'IDLE' | 'EXPERIMENT_ACTIVE' | 'REPORT';

function App() {
  const [status, setStatus] = useState<AppState>('IDLE');
  const [userVector, setUserVector] = useState<number[]>(new Array(10).fill(0));
  const [interactionHistory, setInteractionHistory] = useState<{ 
    contentId: number, 
    topic: Topic, 
    type: InteractionType, 
    bubbleScoreAtTime: number 
  }[]>([]);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [skippedIds, setSkippedIds] = useState<Set<number>>(new Set());
  const [diversityMode, setDiversityMode] = useState(false);
  const [currentFeed, setCurrentFeed] = useState<(ContentItem & { score: ScoreBreakdown })[]>([]);
  const [lastInteractedId, setLastInteractedId] = useState<number | undefined>();
  const [showNetwork, setShowNetwork] = useState(false);

  const bubbleScore = useMemo(() => {
    return calculateBubbleScore(userVector, interactionHistory);
  }, [userVector, interactionHistory]);

  const scoredAllContent = useMemo(() => {
    return contentDB.map(c => ({
      ...c,
      score: scoreContent(c, userVector, interactionHistory, diversityMode)
    })).sort((a, b) => b.score.finalScore - a.score.finalScore);
  }, [userVector, interactionHistory, diversityMode]);

  const startExperiment = () => {
    const initialFeed = generateFeed(contentDB, userVector, [], 8, diversityMode);
    setCurrentFeed(initialFeed);
    setStatus('EXPERIMENT_ACTIVE');
  };

  const handleInteraction = useCallback((contentId: number, type: InteractionType) => {
    const item = contentDB.find(c => c.id === contentId);
    if (!item) return;

    setLastInteractedId(contentId);

    // Update state based on interaction
    if (type === 'like') likedIds.add(contentId);
    if (type === 'skip') skippedIds.add(contentId);
    viewedIds.add(contentId);

    setViewedIds(new Set(viewedIds));
    setLikedIds(new Set(likedIds));
    setSkippedIds(new Set(skippedIds));

    // Update user vector
    const newUserVector = updateUserVector(userVector, item.embedding, type);
    setUserVector(newUserVector);

    // Add to history
    const newHistoryItem = { 
      contentId, 
      topic: item.topic, 
      type, 
      bubbleScoreAtTime: calculateBubbleScore(newUserVector, [...interactionHistory, { topic: item.topic }]) 
    };
    const newHistory = [...interactionHistory, newHistoryItem];
    setInteractionHistory(newHistory);

    // Check if experiment complete
    if (newHistory.length >= 30) {
      setTimeout(() => setStatus('REPORT'), 1000);
      return;
    }

    // Refresh feed every 5 interactions
    if (newHistory.length % 5 === 0) {
      const newFeed = generateFeed(contentDB, newUserVector, newHistory, 8, diversityMode);
      setCurrentFeed(newFeed);
    }
  }, [userVector, interactionHistory, viewedIds, likedIds, skippedIds, diversityMode]);

  const resetExperiment = (diversity: boolean) => {
    setUserVector(new Array(10).fill(0));
    setInteractionHistory([]);
    setViewedIds(new Set());
    setLikedIds(new Set());
    setSkippedIds(new Set());
    setDiversityMode(diversity);
    setLastInteractedId(undefined);
    
    const initialFeed = generateFeed(contentDB, new Array(10).fill(0), [], 8, diversity);
    setCurrentFeed(initialFeed);
    setStatus('EXPERIMENT_ACTIVE');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navigation 
        interactionCount={interactionHistory.length} 
        bubbleScore={bubbleScore}
        diversityMode={diversityMode}
        onToggleDiversity={() => setDiversityMode(!diversityMode)}
      />

      <main className="flex-1 relative">
        {status === 'IDLE' && <Hero onStart={startExperiment} />}

        {status === 'EXPERIMENT_ACTIVE' && (
          <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden">
            {/* Split Screen Container */}
            <div className="flex w-full h-full divide-x-2 divide-engine-border">
              {/* Left Side: Feed */}
              <div className="w-1/2 h-full">
                <FeedSide 
                  feed={currentFeed}
                  likedIds={likedIds}
                  viewedIds={viewedIds}
                  onLike={(id) => handleInteraction(id, 'like')}
                  onView={(id) => handleInteraction(id, 'click')}
                  onSkip={(id) => handleInteraction(id, 'skip')}
                />
              </div>

              {/* Right Side: Engine */}
              <div className="w-1/2 h-full bg-engine-black relative">
                <div 
                  className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-algo-green to-algo-cyan opacity-50 z-20 pointer-events-none" 
                  style={{ left: '-1px' }}
                />
                <EngineSide 
                  userVector={userVector}
                  scoredContent={scoredAllContent.slice(0, 15)}
                  bubbleScore={bubbleScore}
                  lastInteractedId={lastInteractedId}
                />
                <button 
                  onClick={() => setShowNetwork(true)}
                  className="absolute bottom-4 right-4 p-2 bg-engine-panel border border-engine-border rounded-lg text-white font-mono text-[10px] uppercase hover:bg-engine-border transition-colors z-30"
                >
                  Expand Network View
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'REPORT' && (
          <Report 
            userVector={userVector} 
            bubbleScore={bubbleScore} 
            interactionHistory={interactionHistory} 
            onReset={resetExperiment}
          />
        )}
      </main>

      {showNetwork && (
        <NetworkGraph 
          contentDB={contentDB}
          viewedIds={viewedIds}
          likedIds={likedIds}
          skippedIds={skippedIds}
          onClose={() => setShowNetwork(false)}
        />
      )}

      {/* Mobile Overlay warning - though we made it desktop first */}
      <div className="md:hidden fixed inset-0 z-[100] bg-engine-black text-white flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">AlgoLens is best experienced on Desktop</h2>
        <p className="font-mono text-sm text-engine-dim mb-8">The split-reality view requires a larger screen to visualize the algorithmic internals properly.</p>
        <button 
          onClick={() => setStatus('IDLE')}
          className="px-8 py-3 bg-algo-green text-engine-black font-bold rounded-xl"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

export default App;
