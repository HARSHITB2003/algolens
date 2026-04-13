import type { ContentItem, Topic } from './constants';

export type InteractionType = 'like' | 'click' | 'skip' | 'linger';

export function updateUserVector(userVector: number[], contentEmbedding: number[], interactionType: InteractionType): number[] {
  const learningRate: Record<InteractionType, number> = {
    like: 0.15,    // strong positive signal
    click: 0.08,   // moderate positive signal
    skip: -0.05,   // weak negative signal
    linger: 0.04   // slight positive (viewed but no action)
  };

  const rate = learningRate[interactionType];
  const newVector = userVector.map((val, i) => {
    const updated = val + (rate * contentEmbedding[i]);
    return Math.max(-1, Math.min(1, updated)); // clamp to [-1, 1]
  });

  return newVector;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export interface ScoreBreakdown {
  contentId: number;
  relevance: number;
  engagementPred: number;
  recencyBoost: number;
  diversityPenalty: number;
  diversityBoost: number;
  finalScore: number;
}

export function scoreContent(
  content: ContentItem, 
  userVector: number[], 
  interactionHistory: { topic: Topic, contentId: number }[], 
  diversityMode = false
): ScoreBreakdown {
  // 1. Topic relevance (cosine similarity)
  const relevance = cosineSimilarity(userVector, content.embedding);

  // 2. Engagement prediction
  const engagementPred = content.engagement * (0.5 + 0.5 * Math.max(0, relevance));

  // 3. Recency boost (simulate)
  const recencyBoost = content.recencyScore || Math.random() * 0.3;

  // 4. Diversity penalty (if user has seen 3+ items from same topic recently)
  // We'll look at the last 10 interactions for the penalty
  const recentHistory = interactionHistory.slice(-10);
  const topicCount = recentHistory.filter(h => h.topic === content.topic).length;
  const diversityPenalty = topicCount >= 3 ? -0.2 * (topicCount - 2) : 0;

  // 5. Diversity injection
  let diversityBoost = 0;
  if (diversityMode) {
    const topicExposure = interactionHistory.filter(h => h.topic === content.topic).length;
    const avgExposure = interactionHistory.length / 10;
    if (topicExposure < avgExposure * 0.5) {
      diversityBoost = 0.25;
    }
  }

  const finalScore = (relevance * 0.45) + (engagementPred * 0.25) + (recencyBoost * 0.1) + diversityPenalty + diversityBoost;

  return {
    contentId: content.id,
    relevance: parseFloat(relevance.toFixed(3)),
    engagementPred: parseFloat(engagementPred.toFixed(3)),
    recencyBoost: parseFloat(recencyBoost.toFixed(3)),
    diversityPenalty: parseFloat(diversityPenalty.toFixed(3)),
    diversityBoost: parseFloat(diversityBoost.toFixed(3)),
    finalScore: parseFloat(Math.max(0, finalScore).toFixed(3))
  };
}

export function generateFeed(
  contentDB: ContentItem[], 
  userVector: number[], 
  interactionHistory: { topic: Topic, contentId: number }[], 
  feedSize = 8, 
  diversityMode = false
): (ContentItem & { score: ScoreBreakdown })[] {
  const shownIds = new Set(interactionHistory.map(h => h.contentId));
  const available = contentDB.filter(c => !shownIds.has(c.id));

  // If we run out of content, recycle but with penalty or just pick some
  let pool = available;
  if (pool.length < feedSize) {
    pool = contentDB; // Simple recycle for this demo
  }

  const scored = pool.map(content => ({
    ...content,
    score: scoreContent(content, userVector, interactionHistory, diversityMode)
  }));

  scored.sort((a, b) => b.score.finalScore - a.score.finalScore);

  return scored.slice(0, feedSize);
}

export function calculateBubbleScore(userVector: number[], interactionHistory: { topic: Topic }[]): number {
  if (interactionHistory.length < 3) return 0;

  const absValues = userVector.map(v => Math.abs(v));
  const maxVal = Math.max(...absValues);
  const sum = absValues.reduce((a, b) => a + b, 0);
  const uniformity = sum > 0 ? maxVal / (sum / absValues.length) : 0;

  const topicSet = new Set(interactionHistory.map(h => h.topic));
  const topicDiversity = topicSet.size / 10;

  const topicCounts: Record<string, number> = {};
  interactionHistory.forEach(h => { topicCounts[h.topic] = (topicCounts[h.topic] || 0) + 1; });
  const sortedCounts = Object.values(topicCounts).sort((a, b) => b - a);
  const top2Ratio = (sortedCounts[0] + (sortedCounts[1] || 0)) / interactionHistory.length;

  const bubbleScore = Math.round(
    (uniformity * 25) + (top2Ratio * 45) + ((1 - topicDiversity) * 30)
  );

  return Math.min(100, Math.max(0, bubbleScore));
}
