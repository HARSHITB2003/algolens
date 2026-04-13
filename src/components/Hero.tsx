import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-feed-white to-engine-black p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center z-10"
      >
        <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 tracking-tight">
          Your Feed Has a Brain.<br />
          <span className="text-algo-green">Watch It Think.</span>
        </h1>
        
        <p className="font-feed text-lg md:text-xl text-engine-dim mb-10 max-w-2xl mx-auto leading-relaxed">
          Interact with a simulated social media feed. Watch the recommendation algorithm learn your preferences, score every piece of content, and build a filter bubble around you in real time.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="px-6 py-2 rounded-full border border-feed-grey bg-white/50 backdrop-blur-sm text-sm font-semibold">50 Content Items</div>
          <div className="px-6 py-2 rounded-full border border-feed-grey bg-white/50 backdrop-blur-sm text-sm font-semibold">10 Topics</div>
          <div className="px-6 py-2 rounded-full border border-feed-grey bg-white/50 backdrop-blur-sm text-sm font-semibold text-algo-red">30 interactions to bubble</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-engine-black rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 w-1/2 bg-feed-blue group-hover:bg-feed-blue/80 transition-colors" />
          <div className="absolute inset-0 left-1/2 w-1/2 bg-algo-green group-hover:bg-algo-green/80 transition-colors" />
          <span className="relative z-10">Enter The Feed</span>
        </motion.button>

        <p className="mt-8 font-mono text-xs text-engine-faint uppercase tracking-widest animate-pulse">
          Scroll. Click. Like. Skip. The algorithm is watching.
        </p>
      </motion.div>

      {/* Background visual elements */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-feed-grey to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-feed-grey to-transparent opacity-50" />
    </div>
  );
};

export default Hero;
