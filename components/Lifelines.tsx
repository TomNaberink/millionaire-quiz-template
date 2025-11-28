import React from 'react';
import { Phone, Users } from 'lucide-react';
import { GameState } from '../types';

interface LifelinesProps {
  gameState: GameState;
  onUseLifeline: (type: 'fiftyFifty' | 'phoneAFriend' | 'askTheAudience') => void;
}

const Lifelines: React.FC<LifelinesProps> = ({ gameState, onUseLifeline }) => {
  const { lifelines } = gameState;

  const btnClass = (used: boolean) => `
    relative group flex items-center justify-center w-16 h-12 md:w-20 md:h-16 
    rounded-full border-2 transition-all duration-300
    ${used 
      ? 'border-gray-600 text-gray-600 bg-gray-900 cursor-not-allowed' 
      : 'border-mil-gold text-mil-gold bg-blue-900 hover:bg-blue-800 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer'
    }
  `;

  // Disable interaction if not strictly in playing mode (e.g. locked or revealing)
  const isDisabled = gameState.status !== 'playing';

  return (
    <div className="flex gap-4 justify-center mb-6">
      {/* 50:50 */}
      <button 
        className={btnClass(lifelines.fiftyFifty.used)}
        onClick={() => !isDisabled && !lifelines.fiftyFifty.used && onUseLifeline('fiftyFifty')}
        disabled={isDisabled || lifelines.fiftyFifty.used}
        title="50:50"
      >
        <div className="flex font-bold text-sm md:text-lg">
          <span>50</span><span className="text-xs md:text-sm mx-0.5">:</span><span>50</span>
        </div>
        {!lifelines.fiftyFifty.used && (
            <div className="absolute inset-0 rounded-full border border-white/20 -z-10"></div>
        )}
      </button>

      {/* Phone a Friend */}
      <button 
        className={btnClass(lifelines.phoneAFriend.used)}
        onClick={() => !isDisabled && !lifelines.phoneAFriend.used && onUseLifeline('phoneAFriend')}
        disabled={isDisabled || lifelines.phoneAFriend.used}
        title="Bel een vriend"
      >
        <Phone size={24} />
      </button>

      {/* Ask Audience */}
      <button 
        className={btnClass(lifelines.askTheAudience.used)}
        onClick={() => !isDisabled && !lifelines.askTheAudience.used && onUseLifeline('askTheAudience')}
        disabled={isDisabled || lifelines.askTheAudience.used}
        title="Vraag het publiek"
      >
        <Users size={24} />
      </button>
    </div>
  );
};

export default Lifelines;