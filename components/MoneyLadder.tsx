import React from 'react';
import { MONEY_LADDER, SAFE_HAVENS } from '../types';

interface MoneyLadderProps {
  currentQuestionIndex: number;
}

const MoneyLadder: React.FC<MoneyLadderProps> = ({ currentQuestionIndex }) => {
  // Reverse the ladder so the highest amount is on top
  const ladder = [...MONEY_LADDER].map((amount, index) => ({ amount, index })).reverse();

  return (
    <div className="bg-slate-900/80 border-2 border-mil-gold/50 rounded-lg p-4 w-full max-w-xs md:w-64">
      <ul className="space-y-1">
        {ladder.map(({ amount, index }) => {
          const isCurrent = index === currentQuestionIndex;
          const isPassed = index < currentQuestionIndex;
          const isSafeHaven = SAFE_HAVENS.includes(index);
          const isMillion = index === 14;

          let textColor = "text-yellow-500";
          if (isSafeHaven || isMillion) textColor = "text-white font-bold";
          if (isCurrent) textColor = "text-black";

          let bgClass = "";
          if (isCurrent) bgClass = "bg-mil-orange border-mil-gold";
          else if (isPassed) bgClass = "opacity-50";

          return (
            <li 
              key={index} 
              className={`
                flex justify-between items-center px-2 py-0.5 rounded
                ${bgClass}
                ${isCurrent ? 'scale-105 shadow-lg shadow-orange-500/20' : ''}
                transition-all duration-300
              `}
            >
              <span className={`text-xs ${isCurrent ? 'text-black' : 'text-yellow-600'}`}>
                {index + 1}
              </span>
              <span className={`${textColor} font-mono tracking-wider`}>
                € {amount.toLocaleString('nl-NL')}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyLadder;