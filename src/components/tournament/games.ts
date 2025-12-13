export interface Game {
  id: string;
  name: string;
  value: string;
  logo: string;
  logoDark?: string;
  description?: string;
  categories: string[];
  popularity: number;
}

export const games: Game[] = [
  {
    id: 'lol',
    name: 'League of Legends',
    value: 'League of Legends',
    logo: '',
    logoDark: '/gamelogo/lol.png',
    description: 'MOBA game 5v5',
    categories: ['MOBA', 'Strategy', 'Team'],
    popularity: 10
  },
  {
    id: 'valorant',
    name: 'Valorant',
    value: 'Valorant',
    logo: 'https://cdn-icons-png.flaticon.com/512/785/785114.png',
    description: 'Tactical FPS shooter',
    categories: ['FPS', 'Tactical', 'Shooter'],
    popularity: 9
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    value: 'Counter-Strike 2',
    logo: 'https://cdn-icons-png.flaticon.com/512/871/871366.png',
    description: 'First-person shooter',
    categories: ['FPS', 'Tactical', 'Shooter'],
    popularity: 9
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    value: 'Dota 2',
    logo: 'https://cdn-icons-png.flaticon.com/512/871/871319.png',
    description: 'MOBA game',
    categories: ['MOBA', 'Strategy', 'Team'],
    popularity: 8
  },
  {
    id: 'pubg',
    name: 'PUBG',
    value: 'PUBG',
    logo: 'https://cdn-icons-png.flaticon.com/512/1752/1752778.png',
    description: 'Battle Royale',
    categories: ['Battle Royale', 'Shooter', 'Survival'],
    popularity: 8
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    value: 'Mobile Legends',
    logo: 'https://cdn-icons-png.flaticon.com/512/871/871362.png',
    description: 'Mobile MOBA game',
    categories: ['MOBA', 'Mobile', 'Strategy'],
    popularity: 9
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    value: 'Free Fire',
    logo: 'https://cdn-icons-png.flaticon.com/512/785/785098.png',
    description: 'Mobile Battle Royale',
    categories: ['Battle Royale', 'Mobile', 'Shooter'],
    popularity: 8
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    value: 'Overwatch 2',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968816.png',
    description: 'Team-based shooter',
    categories: ['FPS', 'Hero Shooter', 'Team'],
    popularity: 7
  },
  {
    id: 'rainbowsix',
    name: 'Rainbow Six Siege',
    value: 'Rainbow Six Siege',
    logo: 'https://cdn-icons-png.flaticon.com/512/825/825555.png',
    description: 'Tactical shooter',
    categories: ['FPS', 'Tactical', 'Strategy'],
    popularity: 7
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    value: 'Apex Legends',
    logo: 'https://cdn-icons-png.flaticon.com/512/7424/7424774.png',
    description: 'Battle Royale hero shooter',
    categories: ['Battle Royale', 'Hero Shooter', 'FPS'],
    popularity: 8
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    value: 'Fortnite',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968792.png',
    description: 'Battle Royale building game',
    categories: ['Battle Royale', 'Building', 'Action'],
    popularity: 8
  },
  {
    id: 'wildrift',
    name: 'League of Legends: Wild Rift',
    value: 'Wild Rift',
    logo: 'https://cdn-icons-png.flaticon.com/512/10660/10660861.png',
    description: 'Mobile version of LoL',
    categories: ['MOBA', 'Mobile', 'Strategy'],
    popularity: 7
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    value: 'Call of Duty Mobile',
    logo: 'https://cdn-icons-png.flaticon.com/512/871/871335.png',
    description: 'Mobile FPS',
    categories: ['FPS', 'Mobile', 'Shooter'],
    popularity: 7
  },
  {
    id: 'rocketleague',
    name: 'Rocket League',
    value: 'Rocket League',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968808.png',
    description: 'Soccer with cars',
    categories: ['Sports', 'Racing', 'Arcade'],
    popularity: 6
  },
  {
    id: 'other',
    name: 'Game khác',
    value: 'Other',
    logo: 'https://cdn-icons-png.flaticon.com/512/3612/3612569.png',
    description: 'Game khác',
    categories: ['Other'],
    popularity: 1
  }
];

// Sort by popularity
export const sortedGames = [...games].sort((a, b) => b.popularity - a.popularity);

// Get game by value
export const getGameByValue = (value: string): Game | undefined => {
  return games.find(game => game.value === value);
};

// Get game by id
export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

// Get games by category
export const getGamesByCategory = (category: string): Game[] => {
  return games.filter(game => game.categories.includes(category));
};

// Search games
export const searchGames = (query: string): Game[] => {
  const lowerQuery = query.toLowerCase();
  return games.filter(game => 
    game.name.toLowerCase().includes(lowerQuery) ||
    game.description?.toLowerCase().includes(lowerQuery) ||
    game.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
};