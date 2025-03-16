import { create } from 'zustand';
import { Bet } from '../types/bet';

interface BetStore {
  bets: Bet[];
  activeBet: Bet | null;
  addBet: (bet: Bet) => void;
  updateBet: (betId: string, updatedBet: Partial<Bet>) => void;
  setActiveBet: (bet: Bet | null) => void;
  joinBet: (betId: string, userId: string, choice: string, amount: number) => void;
  resolveBet: (betId: string, outcome: string) => void;
}

export const useBetStore = create<BetStore>((set) => ({
  bets: [],
  activeBet: null,
  addBet: (bet) =>
    set((state) => ({
      bets: [...state.bets, bet],
    })),
  updateBet: (betId, updatedBet) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet._id === betId ? { ...bet, ...updatedBet } : bet
      ),
    })),
  setActiveBet: (bet) =>
    set({
      activeBet: bet,
    }),
  joinBet: (betId, userId, choice, amount) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet._id === betId
          ? {
              ...bet,
              participants: [
                ...bet.participants,
                {
                  user: userId,
                  choice,
                  amount,
                  status: 'accepted',
                },
              ],
              totalPool: bet.totalPool + amount,
            }
          : bet
      ),
    })),
  resolveBet: (betId, outcome) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet._id === betId
          ? {
              ...bet,
              status: 'completed',
              outcome,
            }
          : bet
      ),
    })),
})); 