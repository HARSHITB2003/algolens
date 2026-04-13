export type Topic = 'politics_left' | 'politics_right' | 'tech' | 'science' | 'sports' | 'music' | 'food' | 'fashion' | 'finance' | 'memes';

export interface ContentItem {
  id: number;
  topic: Topic;
  title: string;
  engagement: number;
  tags: string[];
  embedding: number[];
  recencyScore?: number;
}

export const TOPICS: Topic[] = [
  'politics_left', 'politics_right', 'tech', 'science', 'sports', 
  'music', 'food', 'fashion', 'finance', 'memes'
];

export const TOPIC_LABELS: Record<Topic, string> = {
  politics_left: 'Politics L',
  politics_right: 'Politics R',
  tech: 'Tech',
  science: 'Science',
  sports: 'Sports',
  music: 'Music',
  food: 'Food',
  fashion: 'Fashion',
  finance: 'Finance',
  memes: 'Memes'
};

export const TOPIC_COLORS: Record<Topic, string> = {
  politics_left: 'var(--color-pol-left)',
  politics_right: 'var(--color-pol-right)',
  tech: 'var(--color-tech)',
  science: 'var(--color-science)',
  sports: 'var(--color-sports)',
  music: 'var(--color-music)',
  food: 'var(--color-food)',
  fashion: 'var(--color-fashion)',
  finance: 'var(--color-finance)',
  memes: 'var(--color-memes)'
};

export const contentDB: ContentItem[] = [
  // POLITICS LEFT (5 cards)
  { id: 1, topic: "politics_left", title: "Government Announces £2B Investment in Green Energy", engagement: 0.72, tags: ["policy","climate","spending"], embedding: [0.9,0.1,0.1,0.2,0,0,0,0,0.1,0] },
  { id: 2, topic: "politics_left", title: "New Study: Universal Basic Income Reduces Poverty by 34%", engagement: 0.68, tags: ["research","welfare","economics"], embedding: [0.85,0.15,0.2,0.3,0,0,0,0,0.2,0] },
  { id: 3, topic: "politics_left", title: "NHS Waiting Lists Hit Record Low After Funding Boost", engagement: 0.81, tags: ["health","public services","reform"], embedding: [0.88,0.1,0.1,0.15,0,0,0,0,0,0] },
  { id: 4, topic: "politics_left", title: "Trade Unions Report Highest Membership in 20 Years", engagement: 0.55, tags: ["labour","workers","organising"], embedding: [0.92,0.08,0.05,0.1,0,0,0,0,0.1,0] },
  { id: 5, topic: "politics_left", title: "Rent Control Legislation Passes First Parliamentary Reading", engagement: 0.74, tags: ["housing","policy","affordability"], embedding: [0.87,0.12,0.1,0.1,0,0,0,0,0.15,0] },

  // POLITICS RIGHT (5 cards)
  { id: 6, topic: "politics_right", title: "Tax Cuts Credited with Small Business Growth Surge", engagement: 0.69, tags: ["economy","tax","enterprise"], embedding: [0.1,0.9,0.15,0.1,0,0,0,0,0.2,0] },
  { id: 7, topic: "politics_right", title: "Defence Secretary: Military Spending to Reach 3% GDP", engagement: 0.71, tags: ["defence","security","spending"], embedding: [0.08,0.88,0.1,0.05,0,0,0,0,0.1,0] },
  { id: 8, topic: "politics_right", title: "Immigration Numbers Drop After Border Policy Reform", engagement: 0.77, tags: ["immigration","borders","policy"], embedding: [0.12,0.92,0.05,0.1,0,0,0,0,0,0] },
  { id: 9, topic: "politics_right", title: "Deregulation Package Expected to Boost Housing Supply", engagement: 0.63, tags: ["housing","regulation","market"], embedding: [0.1,0.85,0.1,0.1,0,0,0,0,0.15,0] },
  { id: 10, topic: "politics_right", title: "Free Speech Bill Clears Committee Stage", engagement: 0.66, tags: ["speech","rights","legislation"], embedding: [0.15,0.87,0.1,0.15,0,0,0,0,0,0] },

  // TECH (5 cards)
  { id: 11, topic: "tech", title: "GPT-5 Passes Medical Licensing Exam with 96% Accuracy", engagement: 0.88, tags: ["ai","medicine","breakthrough"], embedding: [0.1,0.05,0.92,0.4,0,0,0,0,0,0] },
  { id: 12, topic: "tech", title: "Apple Reveals Mixed Reality Headset Gen 2 at WWDC", engagement: 0.82, tags: ["apple","vr","hardware"], embedding: [0.05,0.05,0.95,0.1,0,0,0,0,0,0.1] },
  { id: 13, topic: "tech", title: "Open Source AI Model Outperforms Closed Competitors", engagement: 0.79, tags: ["opensource","ai","competition"], embedding: [0.1,0.05,0.93,0.3,0,0,0,0,0,0] },
  { id: 14, topic: "tech", title: "Quantum Computing Hits 1000 Qubit Milestone", engagement: 0.75, tags: ["quantum","computing","research"], embedding: [0.05,0.05,0.88,0.5,0,0,0,0,0,0] },
  { id: 15, topic: "tech", title: "EU Proposes Mandatory Algorithm Transparency for Platforms", engagement: 0.71, tags: ["regulation","algorithms","transparency"], embedding: [0.3,0.1,0.85,0.2,0,0,0,0,0,0] },

  // SCIENCE (5 cards)
  { id: 16, topic: "science", title: "CRISPR Gene Therapy Cures Sickle Cell in Clinical Trial", engagement: 0.91, tags: ["genetics","medicine","breakthrough"], embedding: [0.1,0.05,0.3,0.95,0,0,0,0,0,0] },
  { id: 17, topic: "science", title: "James Webb Telescope Detects New Biosignature on Exoplanet", engagement: 0.86, tags: ["space","astro","discovery"], embedding: [0.05,0.05,0.2,0.93,0,0,0,0,0,0] },
  { id: 18, topic: "science", title: "Antarctic Ice Sheet Losing Mass Faster Than Models Predicted", engagement: 0.73, tags: ["climate","ice","research"], embedding: [0.2,0.05,0.15,0.9,0,0,0,0,0,0] },
  { id: 19, topic: "science", title: "New Battery Chemistry Achieves 5x Energy Density", engagement: 0.80, tags: ["energy","battery","materials"], embedding: [0.1,0.05,0.4,0.88,0,0,0,0,0,0] },
  { id: 20, topic: "science", title: "Researchers Map Complete Neural Connectome of Mouse Brain", engagement: 0.77, tags: ["neuro","brain","mapping"], embedding: [0.05,0.05,0.25,0.92,0,0,0,0,0,0] },

  // SPORTS (5 cards)
  { id: 21, topic: "sports", title: "Premier League Weekend: Liverpool Beat Arsenal 3-1", engagement: 0.84, tags: ["football","prem","results"], embedding: [0,0,0,0,0.95,0,0,0,0,0.1] },
  { id: 22, topic: "sports", title: "British Tennis Star Reaches Grand Slam Semi-Final", engagement: 0.78, tags: ["tennis","british","slam"], embedding: [0,0,0,0,0.92,0,0,0,0,0] },
  { id: 23, topic: "sports", title: "F1: New Engine Regulations Shake Up Constructor Rankings", engagement: 0.72, tags: ["f1","racing","regulations"], embedding: [0,0,0.1,0,0.9,0,0,0,0,0] },
  { id: 24, topic: "sports", title: "Rugby Six Nations: England vs France Preview", engagement: 0.76, tags: ["rugby","sixnations","preview"], embedding: [0,0,0,0,0.93,0,0,0,0,0] },
  { id: 25, topic: "sports", title: "Olympic Committee Announces 2036 Host City Shortlist", engagement: 0.65, tags: ["olympics","2036","bidding"], embedding: [0,0,0,0,0.88,0,0,0,0,0] },

  // MUSIC (5 cards)
  { id: 26, topic: "music", title: "Beyoncé Drops Surprise Album Overnight", engagement: 0.93, tags: ["beyonce","album","release"], embedding: [0,0,0,0,0,0.95,0,0,0,0.1] },
  { id: 27, topic: "music", title: "Underground UK Garage Revival Taking Over London Clubs", engagement: 0.68, tags: ["garage","uk","clubs"], embedding: [0,0,0,0,0,0.92,0,0.05,0,0] },
  { id: 28, topic: "music", title: "AI-Generated Music Now 18% of All Streaming Uploads", engagement: 0.74, tags: ["ai","streaming","music"], embedding: [0,0,0.3,0,0,0.85,0,0,0,0] },
  { id: 29, topic: "music", title: "Glastonbury 2026 Lineup Announced: Headliners Revealed", engagement: 0.87, tags: ["glastonbury","festival","lineup"], embedding: [0,0,0,0,0,0.93,0,0,0,0] },
  { id: 30, topic: "music", title: "Vinyl Sales Hit All-Time High for Third Consecutive Year", engagement: 0.62, tags: ["vinyl","sales","trend"], embedding: [0,0,0.1,0,0,0.88,0,0,0.1,0] },

  // FOOD (5 cards)
  { id: 31, topic: "food", title: "The Best Ramen in London: A Definitive 2026 Guide", engagement: 0.79, tags: ["ramen","london","guide"], embedding: [0,0,0,0,0,0,0.95,0,0,0] },
  { id: 32, topic: "food", title: "Lab-Grown Chicken Gets UK Food Standards Approval", engagement: 0.76, tags: ["labgrown","chicken","regulation"], embedding: [0,0,0.2,0.2,0,0,0.88,0,0,0] },
  { id: 33, topic: "food", title: "Why Sourdough Fermentation Is Good for Your Gut Microbiome", engagement: 0.71, tags: ["sourdough","gut","health"], embedding: [0,0,0,0.15,0,0,0.92,0,0,0] },
  { id: 34, topic: "food", title: "Michelin Announces 12 New UK Starred Restaurants", engagement: 0.73, tags: ["michelin","restaurants","awards"], embedding: [0,0,0,0,0,0,0.9,0,0.05,0] },
  { id: 35, topic: "food", title: "Budget Meal Prep: Feed a Family of 4 for £25/Week", engagement: 0.82, tags: ["budget","mealprep","family"], embedding: [0,0,0,0,0,0,0.87,0,0.15,0] },

  // FASHION (5 cards)
  { id: 36, topic: "fashion", title: "Sustainable Fashion Brands Outselling Fast Fashion for First Time", engagement: 0.69, tags: ["sustainable","fashion","trend"], embedding: [0.1,0,0,0.1,0,0,0,0.92,0,0] },
  { id: 37, topic: "fashion", title: "London Fashion Week 2026: Key Trends Breakdown", engagement: 0.74, tags: ["lfw","trends","2026"], embedding: [0,0,0,0,0,0,0,0.95,0,0] },
  { id: 38, topic: "fashion", title: "The Return of Quiet Luxury: What It Means in 2026", engagement: 0.66, tags: ["quietluxury","style","trend"], embedding: [0,0,0,0,0,0,0,0.9,0.1,0] },
  { id: 39, topic: "fashion", title: "Charity Shop Finds: How to Thrift Like a Stylist", engagement: 0.72, tags: ["thrift","charity","styling"], embedding: [0,0,0,0,0,0,0,0.88,0.1,0] },
  { id: 40, topic: "fashion", title: "AI Styling Tools: Can Algorithms Replace Personal Shoppers?", engagement: 0.64, tags: ["ai","styling","tech"], embedding: [0,0,0.3,0,0,0,0,0.85,0,0] },

  // FINANCE (5 cards)
  { id: 41, topic: "finance", title: "Bitcoin Breaks Through £80,000 for First Time", engagement: 0.85, tags: ["bitcoin","crypto","markets"], embedding: [0,0,0.2,0,0,0,0,0,0.92,0] },
  { id: 42, topic: "finance", title: "Bank of England Cuts Interest Rates to 3.5%", engagement: 0.78, tags: ["boe","rates","monetary"], embedding: [0.15,0.15,0,0,0,0,0,0,0.9,0] },
  { id: 43, topic: "finance", title: "ISA Season 2026: Best Stocks and Shares ISAs Compared", engagement: 0.71, tags: ["isa","investing","comparison"], embedding: [0,0,0,0,0,0,0,0,0.93,0] },
  { id: 44, topic: "finance", title: "UK Housing Market: Prices Rise 4.2% Year-on-Year", engagement: 0.76, tags: ["housing","prices","market"], embedding: [0.1,0.1,0,0,0,0,0,0,0.88,0] },
  { id: 45, topic: "finance", title: "Side Hustle Economics: How Gen Z Builds Multiple Income Streams", engagement: 0.80, tags: ["sidehustle","genz","income"], embedding: [0,0,0.15,0,0,0,0,0,0.85,0.1] },

  // MEMES (5 cards)
  { id: 46, topic: "memes", title: "The Internet Has Decided: This Cat Is the Meme of 2026", engagement: 0.91, tags: ["cat","meme","viral"], embedding: [0,0,0.1,0,0,0,0,0,0,0.95] },
  { id: 47, topic: "memes", title: "AI-Generated Memes Are Getting Disturbingly Accurate", engagement: 0.83, tags: ["ai","memes","generated"], embedding: [0,0,0.3,0,0,0,0,0,0,0.88] },
  { id: 48, topic: "memes", title: "Every Office Has That One Person: The 2026 Starter Pack", engagement: 0.79, tags: ["office","starterpack","relatable"], embedding: [0,0,0,0,0,0,0,0,0,0.92] },
  { id: 49, topic: "memes", title: "Explaining My Job to My Parents: A Visual Thread", engagement: 0.85, tags: ["job","parents","relatable"], embedding: [0,0,0.15,0,0,0,0,0,0,0.9] },
  { id: 50, topic: "memes", title: "The Algorithm Knows Me Too Well and I Feel Attacked", engagement: 0.88, tags: ["algorithm","meta","self-aware"], embedding: [0,0,0.2,0,0,0,0,0,0,0.93] }
];
