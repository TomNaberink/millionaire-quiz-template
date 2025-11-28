export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number; // Index 0-3
  difficulty: number; // 1-15
  explanation: string; // The "AI" explanation logic
}

export interface GameState {
  currentQuestionIndex: number;
  // 'revealing' is added to show the green/red state before moving next
  // 'feedback' is the popup from the host
  // 'stopped' is when user walks away with the money
  status: 'start' | 'playing' | 'locked' | 'revealing' | 'feedback' | 'gameover' | 'victory' | 'stopped'; 
  lifelines: {
    fiftyFifty: { used: boolean; active: boolean };
    phoneAFriend: { used: boolean };
    askTheAudience: { used: boolean };
  };
  eliminatedAnswers: number[]; // Indices of answers removed by 50:50
  selectedAnswer: number | null;
  winnings: number;
  safeHaven: number;
}

export const MONEY_LADDER = [
  50, 100, 200, 300, 500,        // 500 is Safe Haven 1
  1000, 2000, 4000, 8000, 16000, // 
  32000, 64000, 125000, 250000, 1000000 // 32000 is Safe Haven 2
];

export const SAFE_HAVENS = [4, 9]; // Index 4 (€500) and Index 9 (€32.000)