const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

const extractPage = (startStr, endStr) => {
  const start = content.indexOf(startStr);
  const end = content.indexOf(endStr);
  if (start === -1 || end === -1) return null;
  return content.slice(start + startStr.length, end).trim();
};

const cRate = extractPage(') : activeTab === "rate" ? (\n', ') : activeTab === "game-events" ? (\n');
const cGameEvents = extractPage(') : activeTab === "game-events" ? (\n', ') : activeTab === "giveaways" ? (\n');
const cGiveaways = extractPage(') : activeTab === "giveaways" ? (\n', ') : activeTab === "compare" ? (\n');
const cAds = extractPage('          ) : (\n            <motion.div\n              key="ads"', '            </motion.div>\n          )}\n        </AnimatePresence>\n      </main>');

if (cRate) {
  const rateContent = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Sparkles, TrendingUp, Search, XCircle, Award, MessageSquare, Plus, Loader2, Link as LinkIcon, AlertCircle, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import GameImage from '../components/GameImage';

export default function RatePage(props: any) {
  const {
      videoUrl, setVideoUrl, isAnalyzing, isAiTyping, currentText, currentType, analysisStep, handleAnalyzeVideo, aiRateLimited, aiQuotaError, clips, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, isAdmin, deleteItem, user, handleLogin
  } = props;
  
  return (
` + cRate + `
  );
}
`;
  fs.writeFileSync('src/pages/RatePage.tsx', rateContent);
} else console.log('cRate not found');

if (cGameEvents) {
  const gameEventsContent = `import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Info, Clock, AlertCircle } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import GameImage from '../components/GameImage';

export default function GameEventsPage(props: any) {
  const { gameEvents, getTimeRemaining } = props;
  return (
` + cGameEvents + `
  );
}
`;
  fs.writeFileSync('src/pages/GameEventsPage.tsx', gameEventsContent);
}

if (cGiveaways) {
  const giveawaysContent = `import React from 'react';
import { motion } from 'motion/react';
import { Gift, Infinity as InfinityIcon, LogIn, ExternalLink, Calendar, Users, Trophy, User } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import GameImage from '../components/GameImage';

export default function GiveawaysPage(props: any) {
  const { activeGiveaway, isJoiningGiveaway, handleJoinGiveaway, hasJoinedGiveaway, previousGiveaways, getGiveawayStatus, user, handleLogin } = props;
  return (
` + cGiveaways + `
  );
}
`;
  fs.writeFileSync('src/pages/GiveawaysPage.tsx', giveawaysContent);
}

if (cAds) {
  const adsContent = `import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export default function AdsPage(props: any) {
  const { ads, getIcon } = props;
  return (
    <motion.div key="ads"
` + cAds + `
    </motion.div>
  );
}
`;
  fs.writeFileSync('src/pages/AdsPage.tsx', adsContent);
} else {
  console.log('cAds not found');
}

console.log("Pages extracted successfully.");
