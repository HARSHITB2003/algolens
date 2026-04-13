import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TOPIC_LABELS, TOPIC_COLORS, contentDB, TOPICS } from '../constants';
import type { Topic, ContentItem } from '../constants';

interface ReportProps {
  userVector: number[];
  bubbleScore: number;
  interactionHistory: { contentId: number, topic: Topic, type: string, bubbleScoreAtTime: number }[];
  onReset: (diversity: boolean) => void;
}

const Report: React.FC<ReportProps> = ({ userVector, bubbleScore, interactionHistory, onReset }) => {
  // Data for Radar Chart
  const radarData = TOPICS.map((topic, i) => ({
    subject: TOPIC_LABELS[topic],
    value: Math.max(0, userVector[i] * 100),
    fullMark: 100,
  }));

  // Data for Line Chart
  const lineData = interactionHistory.map((h, i) => ({
    name: i + 1,
    score: h.bubbleScoreAtTime,
  }));

  // Data for Donut Charts
  const availableData = TOPICS.map(t => ({ name: TOPIC_LABELS[t], value: 5, color: TOPIC_COLORS[t] }));
  
  const shownCounts: Record<string, number> = {};
  interactionHistory.forEach(h => { shownCounts[h.topic] = (shownCounts[h.topic] || 0) + 1; });
  const shownData = TOPICS.map(t => ({ 
    name: TOPIC_LABELS[t], 
    value: shownCounts[t] || 0, 
    color: TOPIC_COLORS[t] 
  })).filter(d => d.value > 0);

  // Buried Content (Top engagement items user didn't see)
  const shownIds = new Set(interactionHistory.map(h => h.contentId));
  const buried = contentDB
    .filter(c => !shownIds.has(c.id))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-feed-white p-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <header className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold mb-4">Experiment Complete.</h1>
          <p className="text-xl text-feed-secondary">Your world has narrowed by <span className="text-algo-red font-bold">{bubbleScore}%</span>.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Report 1: Radar Profile */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-feed-grey">
            <h2 className="font-display text-2xl font-bold mb-8">Your Algorithm Profile</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#EFEFEF" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8E8E8E', fontSize: 10 }} />
                  <Radar
                    name="Preference"
                    dataKey="value"
                    stroke="var(--color-algo-cyan)"
                    fill="var(--color-algo-cyan)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-feed-secondary text-center italic">
              The algorithm prioritised these topics above all else.
            </p>
          </section>

          {/* Report 2: Bubble Timeline */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-feed-grey">
            <h2 className="font-display text-2xl font-bold mb-8">Bubble Formation Timeline</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                  <XAxis dataKey="name" label={{ value: 'Interactions', position: 'insideBottom', offset: -5 }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Bubble Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0E17', border: 'none', borderRadius: '8px', color: '#FFF' }}
                    itemStyle={{ color: '#00E68A' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-algo-red)" 
                    strokeWidth={3} 
                    dot={{ fill: 'var(--color-algo-red)', r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-feed-secondary text-center italic">
              Watch how quickly your preferences were locked in.
            </p>
          </section>
        </div>

        {/* Report 3: Comparison */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-feed-grey mb-20">
          <h2 className="font-display text-2xl font-bold mb-12 text-center">What You Saw vs. What Existed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <h3 className="font-mono text-xs uppercase tracking-widest mb-6">Total Content Pool</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={availableData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {availableData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-feed-secondary text-center mt-4">A balanced world of 10 topics.</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-mono text-xs uppercase tracking-widest mb-6">Your Filtered Feed</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={shownData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {shownData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-feed-secondary text-center mt-4">The algorithm narrowed your lens.</p>
            </div>
          </div>
        </section>

        {/* Report 4: Buried */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-bold mb-8">What The Algorithm Hid</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buried.map(item => (
              <div key={item.id} className="bg-white border border-feed-grey p-6 rounded-xl">
                <div className="text-[10px] font-bold uppercase mb-2" style={{ color: TOPIC_COLORS[item.topic] }}>{TOPIC_LABELS[item.topic]}</div>
                <h3 className="font-feed font-semibold mb-4 leading-tight">{item.title}</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-feed-secondary">Engage Score: {(item.engagement * 100).toFixed(0)}%</span>
                  <span className="text-algo-red font-bold">BURIED</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-feed-secondary text-center">These posts were highly popular with others, but were hidden from you because they didn't match your profile.</p>
        </section>

        {/* Final CTA */}
        <section className="bg-engine-black text-white p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-feed-blue via-algo-green to-algo-purple" />
          <h2 className="font-display text-4xl font-bold mb-6">Break Your Bubble?</h2>
          <p className="text-xl text-engine-dim mb-10 max-w-2xl mx-auto">
            Want to see how your feed changes when the algorithm is forced to show you diverse perspectives?
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => onReset(true)}
              className="px-10 py-4 bg-algo-purple hover:bg-algo-purple/80 text-white font-bold rounded-xl transition-all"
            >
              Try Diversity Mode
            </button>
            <button 
              onClick={() => onReset(false)}
              className="px-10 py-4 border border-engine-border hover:bg-engine-border text-white font-bold rounded-xl transition-all"
            >
              Reset Normal Mode
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Report;
