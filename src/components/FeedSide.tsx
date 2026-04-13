import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, SkipForward } from 'lucide-react';
import { TOPIC_LABELS, TOPIC_COLORS } from '../constants';
import type { ContentItem } from '../constants';
import type { ScoreBreakdown } from '../engine';

interface FeedCardProps {
  item: ContentItem & { score: ScoreBreakdown };
  onLike: (id: number) => void;
  onView: (id: number) => void;
  onSkip: (id: number) => void;
  isLiked: boolean;
  isViewed: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onLike, onView, onSkip, isLiked, isViewed }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`w-full max-w-md bg-white rounded-xl shadow-sm border border-feed-grey p-4 mb-4 transition-colors duration-300 ${isViewed ? 'bg-feed-blue/5' : ''} ${isLiked ? 'bg-like-red/5' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span 
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white"
          style={{ backgroundColor: TOPIC_COLORS[item.topic] }}
        >
          {TOPIC_LABELS[item.topic]}
        </span>
        <span className="text-[10px] text-feed-secondary font-mono">ID: {item.id}</span>
      </div>
      
      <h3 className="font-feed font-semibold text-lg text-feed-text leading-snug mb-2">
        {item.title}
      </h3>

      <div className="flex gap-2 mb-4">
        {item.tags.map(tag => (
          <span key={tag} className="text-[10px] text-feed-secondary bg-feed-grey px-2 py-0.5 rounded-full">#{tag}</span>
        ))}
      </div>

      <div className="text-xs text-feed-secondary mb-4">
        1.2K likes · 234 comments
      </div>

      <div className="flex items-center justify-between border-t border-feed-grey pt-3">
        <button 
          onClick={() => onLike(item.id)}
          className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-like-red' : 'text-feed-secondary hover:text-like-red'}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
          <span className="text-xs font-semibold">Like</span>
        </button>

        <button 
          onClick={() => onView(item.id)}
          className={`flex items-center gap-1.5 transition-colors ${isViewed ? 'text-feed-blue' : 'text-feed-secondary hover:text-feed-blue'}`}
        >
          <Eye size={18} />
          <span className="text-xs font-semibold">View</span>
        </button>

        <button 
          onClick={() => onSkip(item.id)}
          className="flex items-center gap-1.5 text-feed-secondary hover:text-engine-black transition-colors"
        >
          <SkipForward size={18} />
          <span className="text-xs font-semibold">Skip</span>
        </button>
      </div>
    </motion.div>
  );
};

interface FeedSideProps {
  feed: (ContentItem & { score: ScoreBreakdown })[];
  onLike: (id: number) => void;
  onView: (id: number) => void;
  onSkip: (id: number) => void;
  likedIds: Set<number>;
  viewedIds: Set<number>;
}

const FeedSide: React.FC<FeedSideProps> = ({ feed, onLike, onView, onSkip, likedIds, viewedIds }) => {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide bg-feed-white p-6 flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        {feed.map((item) => (
          <FeedCard 
            key={item.id} 
            item={item} 
            onLike={onLike}
            onView={onView}
            onSkip={onSkip}
            isLiked={likedIds.has(item.id)}
            isViewed={viewedIds.has(item.id)}
          />
        ))}
      </AnimatePresence>
      <div className="h-20 w-full flex-shrink-0" /> {/* Spacer */}
    </div>
  );
};

export default FeedSide;
