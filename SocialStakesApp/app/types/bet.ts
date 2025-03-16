export interface User {
  _id: string;
  username: string;
  email: string;
  stats: {
    totalBets: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  balance: number;
}

export interface BetOption {
  text: string;
  odds: number;
}

export interface CreateBetData {
  title: string;
  description: string;
  category: 'Sports' | 'E-Sports' | 'Politics' | 'Entertainment' | 'Custom';
  options: BetOption[];
  expiresAt: Date;
  visibility: 'public' | 'friends' | 'private';
}

export interface Bet extends CreateBetData {
  _id: string;
  creator: User;
  participants: {
    user: User;
    selectedOption: number;
    amount: number;
  }[];
  totalPool: number;
  status: 'open' | 'closed' | 'resolved';
  outcome: number | null;
  createdAt: string;
}

export interface BetStore {
  bets: Bet[];
  activeBet: Bet | null;
  addBet: (bet: Bet) => void;
  updateBet: (bet: Bet) => void;
  setActiveBet: (betId: string | null) => void;
  joinBet: (betId: string, userId: string, optionIndex: number, amount: number) => void;
  resolveBet: (betId: string, outcomeIndex: number) => void;
} 