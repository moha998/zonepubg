export interface SensitivitySettings {
  camera: {
    noScope: number;
    redDot: number;
    scope2x: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
    scope8x: number;
  };
  ads: {
    noScope: number;
    redDot: number;
    scope2x: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
    scope8x: number;
  };
  gyroscope: {
    noScope: number;
    redDot: number;
    scope2x: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
    scope8x: number;
  };
}

export interface Device {
  id: string;
  name: string;
  brand: 'Samsung' | 'Apple' | 'RedMagic' | 'Redmi' | 'Pro Player';
  settings: SensitivitySettings;
  code?: string;
  image?: string;
  screenSize?: string;
  useGyroscope?: boolean;
  playStyle?: 'Sniper' | 'Rusher';
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  image?: string;
  category: 'news' | 'uc' | 'event' | 'mode' | 'leaks' | 'updates';
  strategic_note?: string;
}

export interface Character {
  id: string;
  name: string;
  arabicName: string;
  ability: string;
  description: string;
  image: string;
  levelMaxBonus: string;
}

export interface Giveaway {
  id: string;
  title: string;
  prize: string;
  endDate: string;
  participants: number;
  status: 'active' | 'ended';
  image: string;
  createdAt?: any;
  authorId?: string;
  authorEmail?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: any;
  authorId: string;
  authorEmail?: string;
  type?: string;
  isHidden?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  endDate: string;
}

export interface Ad {
  id: string;
  title: string;
  url: string;
  icon: string;
  description?: string;
  createdAt: any;
  authorId: string;
}

export interface Attachment {
  id: string;
  name: string;
  arabicName: string;
  type: 'muzzle' | 'grip' | 'magazine' | 'stock' | 'scope';
  effect: string;
  description: string;
  image: string;
}

export interface NewsComment {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: any;
}

export interface Weapon {
  id: string;
  nameEn: string;
  nameAr: string;
  type: string;
  damage: number;
  recoil: number;
  speed: number;
  range: number;
  ammoType?: string;
  dps?: number;
  image: string;
  bestAttachments?: {
    muzzle?: string;
    grip?: string;
    magazine?: string;
    stock?: string;
    scope?: string;
  };
}

export interface Ranking {
  id: string;
  rank: number;
  playerName: string;
  country: string;
  stats?: string;
  source?: string;
  updatedAt: any;
}

export interface GiveawayEntry {
  id: string;
  giveawayId: string;
  playerName: string;
  playerId: string;
  userId: string;
  createdAt: any;
}

export interface GiveawayWinner {
  id: string;
  giveawayId: string;
  playerName: string;
  playerId: string;
  userId: string;
  prize: string;
  wonAt: string;
  date: string;
  createdAt: any;
}

export interface Clip {
  id: string;
  title: string;
  description?: string;
  url: string;
  videoUrl: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  userName: string;
  userPhoto?: string;
  votes: number;
  voters: string[];
  isWinner?: boolean;
  aiAnalysis?: {
    xray_results?: {
      recoil_stability_score: number;
      movement_speed: string;
      headshot_accuracy_percent: number;
    };
    golden_dashboard?: {
      pro_rating?: string;
      pro_evaluation: string;
      tactical_advice: string;
    };
    analysis?: {
      pro_rating: string;
      recoil_control: number;
      reaction_time_ms: number;
      movement_efficiency: string;
    };
    technical_fix?: {
      sensitivity_delta: string;
      graphic_settings_advice: string;
    };
    strategic_note?: string;
    json_meta?: {
      status: string;
      engine: string;
    };
  };
  createdAt: any;
}

export interface SensitivityRating {
  id: string;
  deviceId: string;
  rating: number;
  comment?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
}

export interface WeaponRating {
  id: string;
  weaponId: string;
  rating: number;
  comment?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  settings: SensitivitySettings;
  status?: 'active' | 'disabled' | 'suspended';
  isBanned?: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export interface CompetitionSettings {
  id: string; // 'royal-pass' | 'best-clip' | 'daily-tournament' | 'global'
  type: 'giveaway' | 'clips' | 'tournament' | 'global';
  startDate: string; // ISO string or datetime-local format
  endDate: string;
  isActive: boolean;
  isAllEventsHidden?: boolean;
  isTournamentsHidden?: boolean;
  isLogoHidden?: boolean;
  isCommentsEnabled?: boolean;
  updatedAt: any;
}

export interface SiteStats {
  visitors: number;
  totalParticipations: number;
  updatedAt: any;
}
