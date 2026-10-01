export interface IngestedItem {
  id: string;
  text: string;
  author: string;
  source: 'web' | 'curl' | 'preset' | 'simulator' | 'discord' | 'github';
  timestamp: string;
  createdAt: string;
  // Computed on the fly
  wordCount: number;
  characterCount: number;
  intent: 'question' | 'bug' | 'praise' | 'feature_request' | 'general';
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0 - 100
  topics: string[];
  readingTimeSec: number;
}

export interface DynamicStats {
  totalItems: number;
  totalWords: number;
  avgWordsPerItem: number;
  avgSentimentScore: number;
  intentCounts: {
    question: number;
    bug: number;
    praise: number;
    feature_request: number;
    general: number;
  };
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topTopics: Array<{ topic: string; count: number; percentage: number }>;
  wordLengthDistribution: Array<{ range: string; count: number }>;
  sentimentVelocity: Array<{ index: number; score: number; label: string; intent: string }>;
  aiExecutiveSummary: string;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'just', 'like', 'really', 'also', 'will', 'get', 'see'
]);

const POSITIVE_WORDS = new Set([
  'love', 'great', 'awesome', 'amazing', 'best', 'good', 'superb', 'fast', 'smooth', 'clean', 'delight',
  'fantastic', 'excellent', 'stellar', 'impressed', 'helpful', 'beautiful', 'flawless', 'incredible', 'rocking', 'cool'
]);

const NEGATIVE_WORDS = new Set([
  'bug', 'error', 'fail', 'failed', 'failing', 'crash', 'crashed', 'crashing', 'broken', 'slow', 'sluggish',
  'glitch', 'timeout', 'timeouts', 'drop', 'dropped', 'bad', 'terrible', 'worst', 'horrible', 'pain', 'frustrating', 'stuck', 'issue'
]);

const KNOWN_DOMAIN_TOPICS = [
  'database', 'mongodb', 'deno', 'serverless', 'superagent', 'auth', 'oauth', 'jwt',
  'websocket', 'realtime', 'performance', 'latency', 'cold-start', 'pricing', 'ui', 'ux',
  'security', 'rls', 'isolate', 'api', 'schema', 'zod', 'recharts', 'tailwind'
];

/**
 * Analyzes a single raw message on the fly
 */
export function analyzeItemOnTheFly(
  raw: { id?: string; text: string; author?: string; source?: IngestedItem['source']; timestamp?: string }
): IngestedItem {
  const text = raw.text.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = text.length;
  const lower = text.toLowerCase();

  // 1. Detect Intent
  let intent: IngestedItem['intent'] = 'general';
  if (
    text.includes('?') || 
    /^(how|why|what|when|where|who|does|can|is|could|should|will|would)\b/i.test(lower) ||
    lower.includes('how do') || 
    lower.includes('is there') || 
    lower.includes('can i')
  ) {
    intent = 'question';
  } else if (
    Array.from(NEGATIVE_WORDS).some(w => lower.includes(w)) || 
    lower.includes('not working') || 
    lower.includes('doesn\'t work')
  ) {
    intent = 'bug';
  } else if (
    Array.from(POSITIVE_WORDS).some(w => lower.includes(w)) || 
    lower.includes('thank') || 
    lower.includes('kudos')
  ) {
    intent = 'praise';
  } else if (
    lower.includes('feature') || 
    lower.includes('would love') || 
    lower.includes('can we add') || 
    lower.includes('support for') || 
    lower.includes('please add')
  ) {
    intent = 'feature_request';
  }

  // 2. Extract Topics & Keywords on the fly
  const extractedTopics = new Set<string>();

  // Check known domain topics
  KNOWN_DOMAIN_TOPICS.forEach(topic => {
    if (lower.includes(topic)) {
      extractedTopics.add(topic);
    }
  });

  // Extract meaningful non-stopword tokens (>= 4 letters)
  words.forEach(w => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (cleanWord.length >= 4 && !STOP_WORDS.has(cleanWord) && !POSITIVE_WORDS.has(cleanWord) && !NEGATIVE_WORDS.has(cleanWord)) {
      extractedTopics.add(cleanWord);
    }
  });

  // Keep top 4 topics per item
  const topics = Array.from(extractedTopics).slice(0, 4);
  if (topics.length === 0) {
    topics.push(intent === 'question' ? 'inquiry' : 'general');
  }

  // 3. Compute Sentiment Score (0 - 100)
  let posHits = 0;
  let negHits = 0;
  words.forEach(w => {
    const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
    if (POSITIVE_WORDS.has(cleanWord)) posHits++;
    if (NEGATIVE_WORDS.has(cleanWord)) negHits++;
  });

  let sentimentScore = 50; // Neutral baseline
  if (posHits > negHits) {
    sentimentScore = Math.min(100, 60 + posHits * 18);
  } else if (negHits > posHits) {
    sentimentScore = Math.max(0, 40 - negHits * 20);
  } else if (intent === 'praise') {
    sentimentScore = 88;
  } else if (intent === 'bug') {
    sentimentScore = 20;
  }

  const sentiment: IngestedItem['sentiment'] =
    sentimentScore >= 60 ? 'positive' : sentimentScore <= 40 ? 'negative' : 'neutral';

  return {
    id: raw.id || `fb-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    text,
    author: raw.author || 'guest_user',
    source: raw.source || 'web',
    timestamp: raw.timestamp || new Date().toLocaleTimeString(),
    createdAt: new Date().toISOString(),
    wordCount,
    characterCount,
    intent,
    sentiment,
    sentimentScore,
    topics,
    readingTimeSec: Math.max(1, Math.ceil(wordCount / 4)),
  };
}

/**
 * Computes all dashboard statistics dynamically on the fly from the live items array
 */
export function computeStatsOnTheFly(items: IngestedItem[]): DynamicStats {
  const totalItems = items.length;
  if (totalItems === 0) {
    return {
      totalItems: 0,
      totalWords: 0,
      avgWordsPerItem: 0,
      avgSentimentScore: 50,
      intentCounts: { question: 0, bug: 0, praise: 0, feature_request: 0, general: 0 },
      sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
      topTopics: [],
      wordLengthDistribution: [],
      sentimentVelocity: [],
      aiExecutiveSummary: 'Awaiting incoming feedback stream...',
    };
  }

  let totalWords = 0;
  let totalSentiment = 0;
  const intentCounts = { question: 0, bug: 0, praise: 0, feature_request: 0, general: 0 };
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  const topicFrequency: Record<string, number> = {};

  const lengthBins: Record<string, number> = {
    '1-5 words': 0,
    '6-12 words': 0,
    '13-20 words': 0,
    '21+ words': 0,
  };

  items.forEach(item => {
    totalWords += item.wordCount;
    totalSentiment += item.sentimentScore;

    intentCounts[item.intent] = (intentCounts[item.intent] || 0) + 1;
    sentimentCounts[item.sentiment] = (sentimentCounts[item.sentiment] || 0) + 1;

    item.topics.forEach(t => {
      topicFrequency[t] = (topicFrequency[t] || 0) + 1;
    });

    if (item.wordCount <= 5) lengthBins['1-5 words']++;
    else if (item.wordCount <= 12) lengthBins['6-12 words']++;
    else if (item.wordCount <= 20) lengthBins['13-20 words']++;
    else lengthBins['21+ words']++;
  });

  const avgWordsPerItem = Math.round((totalWords / totalItems) * 10) / 10;
  const avgSentimentScore = Math.round(totalSentiment / totalItems);

  // Top topics ranked by frequency
  const topTopics = Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: Math.round((count / totalItems) * 100),
    }));

  const wordLengthDistribution = Object.entries(lengthBins).map(([range, count]) => ({
    range,
    count,
  }));

  // Reverse so newest is rightwards on velocity line
  const recentItems = [...items].slice(0, 15).reverse();
  const sentimentVelocity = recentItems.map((item, idx) => ({
    index: idx + 1,
    score: item.sentimentScore,
    label: `#${idx + 1}`,
    intent: item.intent,
  }));

  // Dynamic AI executive summary generated on the fly
  const topTopicNames = topTopics.slice(0, 2).map(t => `${t.topic} (${t.count})`).join(' and ');
  const primaryIntent = Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0][0].replace('_', ' ');

  const aiExecutiveSummary = `Ingested ${totalItems} items (${totalWords} total words, ~${avgWordsPerItem} words/msg). Primary driver is "${primaryIntent}". Key recurring topics: ${topTopicNames || 'general discussions'}. Live net sentiment is ${avgSentimentScore}% with ${sentimentCounts.positive} positive vs ${sentimentCounts.negative} critical signals.`;

  return {
    totalItems,
    totalWords,
    avgWordsPerItem,
    avgSentimentScore,
    intentCounts,
    sentimentCounts,
    topTopics,
    wordLengthDistribution,
    sentimentVelocity,
    aiExecutiveSummary,
  };
}

export const INITIAL_LIVE_SEED: Array<{ text: string; author: string; source: IngestedItem['source'] }> = [
  {
    text: 'How does Base44 manage connection pooling with MongoDB during Deno serverless cold starts?',
    author: 'alex_dev',
    source: 'github',
  },
  {
    text: 'The Superagent feature generated my entire product feedback pipeline in under 30 seconds! Amazing UX.',
    author: 'sarah_pm',
    source: 'discord',
  },
  {
    text: 'Safari iOS 17 is seeing slight render latency when Recharts renders over 300 data points.',
    author: 'telemetry_probe',
    source: 'web',
  },
  {
    text: 'Can we add multi-tenant Row-Level Security (RLS) guards to the tool execution runtime?',
    author: 'enterprise_lead',
    source: 'curl',
  },
  {
    text: 'Is there a native Linear and Jira export webhook for triaged bugs?',
    author: 'product_dan',
    source: 'discord',
  },
  {
    text: 'JWT session cookie expires unexpectedly on mobile Safari during OAuth token refresh loop.',
    author: 'jordan_mobile',
    source: 'github',
  },
];
