import React, { useMemo } from 'react';
import { ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

interface HostFeedbackProps {
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
  correctAnswerText: string;
  winnings?: number;
}

const HostFeedback: React.FC<HostFeedbackProps> = ({ isCorrect, explanation, onNext, correctAnswerText, winnings }) => {
  
  // Memoize random phrases so they don't change on re-renders
  const phrase = useMemo(() => {
    const correctPhrases = [
      "Dat is... helemaal goed!",
      "Fantastisch! Je gaat als een speer.",
      "Absoluut correct.",
      "Jazeker! We rekenen het goed.",
      "Wat een kennis! Dat is juist."
    ];
    
    const wrongPhrases = [
      "Oei... dat is helaas niet goed.",
      "Ai ai ai, dat is pijnlijk.",
      "Nee, dat is 'm niet.",
      "Helaas, het avontuur eindigt hier.",
      "Dat is jammer, het is fout."
    ];

    const collection = isCorrect ? correctPhrases : wrongPhrases;
    return collection[Math.floor(Math.random() * collection.length)];
  }, [isCorrect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-mil-gold rounded-xl shadow-[0_0_50px_rgba(251,191,36,0.2)] max-w-lg w-full overflow-hidden">
        
        {/* Header Bar */}
        <div className={`h-2 w-full ${isCorrect ? 'bg-mil-green' : 'bg-red-600'}`}></div>
        
        <div className="p-8 flex flex-col items-center text-center">
          
          {/* Icon/Avatar Placeholder */}
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-6 shadow-lg ${
            isCorrect ? 'border-mil-green bg-green-900/30' : 'border-red-600 bg-red-900/30'
          }`}>
             {isCorrect ? <CheckCircle2 size={40} className="text-mil-green" /> : <XCircle size={40} className="text-red-500" />}
          </div>

          <h3 className={`text-2xl md:text-3xl font-serif font-bold mb-2 ${isCorrect ? 'text-mil-gold' : 'text-white'}`}>
            "{phrase}"
          </h3>

          {!isCorrect && (
             <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-4 w-full">
                <span className="text-sm text-red-300 block uppercase tracking-wider mb-1">Het juiste antwoord was:</span>
                <span className="text-xl font-bold text-white">{correctAnswerText}</span>
             </div>
          )}

          <div className="bg-white/5 rounded-lg p-4 mb-8 border border-white/10 w-full">
            <p className="text-blue-100 leading-relaxed italic">
              {explanation}
            </p>
          </div>

          <button 
            onClick={onNext}
            className={`
              group flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105
              ${isCorrect 
                ? 'bg-gradient-to-r from-mil-gold-dark to-mil-gold text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                : 'bg-slate-700 hover:bg-slate-600 text-white border border-white/20'
              }
            `}
          >
            <span>{isCorrect ? 'Volgende Vraag' : 'Naar Resultaat'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default HostFeedback;