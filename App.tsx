import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { GameState, MONEY_LADDER } from './types';
import { questions } from './data/questions';
import MoneyLadder from './components/MoneyLadder';
import Lifelines from './components/Lifelines';
import AnswerButton from './components/AnswerButton';
import Modal from './components/Modal';
import Cheque from './components/Cheque';
import HostFeedback from './components/HostFeedback';
import { playSound } from './utils/audio';

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    status: 'start',
    lifelines: {
      fiftyFifty: { used: false, active: false },
      phoneAFriend: { used: false },
      askTheAudience: { used: false },
    },
    eliminatedAnswers: [],
    selectedAnswer: null,
    winnings: 0,
    safeHaven: 0,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'phone' | 'audience' | null;
    content: React.ReactNode;
  }>({ isOpen: false, type: null, content: null });

  // --- HELPERS ---
  const currentQuestion = questions[gameState.currentQuestionIndex];
  
  // Calculate potential winnings for the NEXT correct answer
  const currentPrizeAmount = MONEY_LADDER[gameState.currentQuestionIndex];

  // Calculate what you have guaranteed SO FAR (if you walk away now)
  // If at question 1 (index 0), you have 0.
  // If at question 2 (index 1), you have completed Q1, so you have ladder[0].
  const walkAwayAmount = gameState.currentQuestionIndex === 0 
    ? 0 
    : MONEY_LADDER[gameState.currentQuestionIndex - 1];

  const calculateSafeHaven = (index: number) => {
    let safeAmount = 0;
    if (index > 9) safeAmount = MONEY_LADDER[9];
    else if (index > 4) safeAmount = MONEY_LADDER[4];
    return safeAmount;
  };

  // --- ACTIONS ---

  const startGame = () => {
    playSound('start');
    setGameState({
      currentQuestionIndex: 0,
      status: 'playing',
      lifelines: {
        fiftyFifty: { used: false, active: false },
        phoneAFriend: { used: false },
        askTheAudience: { used: false },
      },
      eliminatedAnswers: [],
      selectedAnswer: null,
      winnings: 0,
      safeHaven: 0,
    });
  };

  const stopGame = () => {
    playSound('correct'); // Positive sound for making a smart choice
    setGameState(prev => ({
        ...prev,
        status: 'stopped',
        winnings: walkAwayAmount
    }));
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (gameState.status !== 'playing') return;

    // 1. LOCK IN (Orange)
    playSound('lock');
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      status: 'locked'
    }));

    // 2. WAIT FOR DRAMATIC EFFECT (2 seconds)
    setTimeout(() => {
      revealAnswer(answerIndex);
    }, 2000);
  };

  const revealAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // 3. SHOW RESULT (Green/Red)
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setGameState(prev => ({
      ...prev,
      status: 'revealing' // This triggers the Green/Red visual in AnswerButton
    }));

    // 4. TRANSITION TO HOST FEEDBACK (after seeing the result for 2 seconds)
    setTimeout(() => {
        setGameState(prev => ({
            ...prev,
            status: 'feedback'
        }));
    }, 2000);
  };

  const handleFeedbackNext = () => {
    if (gameState.selectedAnswer === null) return;
    
    const isCorrect = gameState.selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
        handleCorrectTransition();
    } else {
        handleGameOverTransition();
    }
  };

  const handleCorrectTransition = () => {
      const newWinnings = MONEY_LADDER[gameState.currentQuestionIndex];
      const isMillion = gameState.currentQuestionIndex === 14;

      if (isMillion) {
        setGameState(prev => ({
          ...prev,
          status: 'victory',
          winnings: newWinnings
        }));
      } else {
        // Move to next question
        setGameState(prev => ({
          ...prev,
          status: 'playing',
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          eliminatedAnswers: [],
          winnings: newWinnings,
          safeHaven: calculateSafeHaven(prev.currentQuestionIndex + 1)
        }));
        playSound('start'); // Little swoosh for next question
      }
  };

  const handleGameOverTransition = () => {
      const finalPrize = calculateSafeHaven(gameState.currentQuestionIndex);
      setGameState(prev => ({
        ...prev,
        status: 'gameover',
        winnings: finalPrize
      }));
  };

  // --- LIFELINES ---

  const useLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askTheAudience') => {
    if (gameState.lifelines[type].used) return;

    setGameState(prev => ({
      ...prev,
      lifelines: {
        ...prev.lifelines,
        [type]: { ...prev.lifelines[type], used: true }
      }
    }));

    if (type === 'fiftyFifty') {
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      const toEliminate = shuffled.slice(0, 2);
      
      setGameState(prev => ({
        ...prev,
        eliminatedAnswers: toEliminate
      }));
    }

    if (type === 'phoneAFriend') {
      const isCorrect = Math.random() > 0.2; 
      const suggestedAnswer = isCorrect 
        ? currentQuestion.answers[currentQuestion.correctAnswer]
        : currentQuestion.answers[Math.floor(Math.random() * 4)];
      
      setModalState({
        isOpen: true,
        type: 'phone',
        content: (
          <div className="flex flex-col gap-4">
            <p className="italic">"Poeh, dat is een lastige... even denken hoor."</p>
            <p>
              "Ik ben er vrij zeker van dat het <span className="font-bold text-mil-gold text-xl">{suggestedAnswer}</span> is."
            </p>
            <p className="text-sm text-gray-400 text-right">- Je vriend Peter</p>
          </div>
        )
      });
    }

    if (type === 'askTheAudience') {
      const diffFactor = currentQuestion.difficulty * 2; 
      const correctIndex = currentQuestion.correctAnswer;
      let weights = [0, 0, 0, 0];
      
      weights[correctIndex] = Math.max(40, 90 - diffFactor); 
      
      let remaining = 100 - weights[correctIndex];
      for(let i=0; i<4; i++) {
        if(i !== correctIndex) {
          const share = Math.random() * remaining;
          weights[i] = share;
          remaining -= share;
        }
      }
      const lastWrong = weights.findIndex((w, i) => i !== correctIndex && weights[i] === 0);
      if(lastWrong !== -1) weights[lastWrong] += remaining; 
      
      const finalPercents = weights.map(w => Math.floor(w));
      const sum = finalPercents.reduce((a,b) => a+b, 0);
      finalPercents[correctIndex] += (100 - sum);

      const labels = ['A', 'B', 'C', 'D'];

      setModalState({
        isOpen: true,
        type: 'audience',
        content: (
            <div className="h-64 flex items-end justify-center gap-4 pt-4">
                {finalPercents.map((pct, idx) => (
                    <div key={idx} className="flex flex-col items-center w-12 group">
                        <span className="mb-1 text-xs md:text-sm font-bold text-mil-gold">{pct}%</span>
                        <div 
                            className="w-full bg-gradient-to-t from-blue-900 to-purple-500 border border-white/20 transition-all duration-1000 ease-out"
                            style={{ height: `${pct * 2}px` }}
                        ></div>
                        <span className="mt-2 text-lg font-bold text-white">{labels[idx]}</span>
                    </div>
                ))}
            </div>
        )
      });
    }
  };

  // --- RENDERING ---

  // Background Elements (Spotlights)
  const BackgroundEffects = () => (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_#0f172a_50%,_#020617_100%)] opacity-80"></div>
        
        {/* Rotating Spotlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] animate-spotlight opacity-20">
             <div className="absolute top-0 left-1/2 w-32 h-[50%] bg-gradient-to-b from-transparent via-blue-500 to-transparent blur-3xl origin-bottom"></div>
             <div className="absolute bottom-0 left-1/2 w-32 h-[50%] bg-gradient-to-t from-transparent via-blue-500 to-transparent blur-3xl origin-top"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] animate-spotlight opacity-20" style={{ animationDirection: 'reverse', animationDuration: '30s' }}>
             <div className="absolute top-1/2 left-0 w-[50%] h-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-3xl origin-right"></div>
             <div className="absolute top-1/2 right-0 w-[50%] h-32 bg-gradient-to-l from-transparent via-purple-500 to-transparent blur-3xl origin-left"></div>
        </div>
      </div>
    </>
  );

  if (gameState.status === 'start') {
    return (
      <>
        <BackgroundEffects />
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 text-center z-10">
          <div className="mb-8 relative animate-pulse-slow">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-950 to-black border-4 border-mil-gold flex items-center justify-center shadow-[0_0_50px_rgba(30,58,138,0.8)]">
                  <div className="text-center">
                      <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-mil-gold to-mil-gold-dark tracking-tighter uppercase leading-none font-serif">
                          Weekend<br/>Miljonairs
                      </h1>
                  </div>
              </div>
          </div>
          
          <p className="text-xl mb-8 text-blue-200 max-w-md">
            Beklim de ladder van 15 vragen. Gebruik je hulplijnen verstandig. Word jij de virtuele miljonair?
          </p>

          <button 
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-b from-purple-600 to-purple-900 rounded-full text-2xl font-bold border-2 border-mil-gold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
          >
            START DE QUIZ
          </button>
        </div>
      </>
    );
  }

  if (gameState.status === 'victory' || gameState.status === 'gameover' || gameState.status === 'stopped') {
    const isVictory = gameState.status === 'victory';
    const isStopped = gameState.status === 'stopped';
    
    let title = 'GAME OVER';
    if (isVictory) title = 'MILJONAIR!';
    if (isStopped) title = 'GEFELICITEERD!';

    return (
      <>
        <BackgroundEffects />
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 text-center z-10">
          {isVictory && <Confetti numberOfPieces={500} recycle={false} />}
          {isStopped && <Confetti numberOfPieces={200} recycle={false} colors={['#fbbf24', '#ffffff']} />}
          
          <h2 className={`text-4xl md:text-6xl font-black mb-8 ${isVictory || isStopped ? 'text-mil-gold' : 'text-gray-400'}`}>
            {title}
          </h2>
          
          <div className="mb-12 w-full animate-in zoom-in duration-500">
             <Cheque amount={gameState.winnings} />
          </div>

          <button 
            onClick={startGame}
            className="px-8 py-3 bg-mil-blue-light border border-white/30 rounded text-xl hover:bg-blue-800 transition-colors text-white"
          >
            Speel Opnieuw
          </button>
        </div>
      </>
    );
  }

  const labelMap = ['A', 'B', 'C', 'D'];
  const canInteract = gameState.status === 'playing';
  
  // Focus Mode: Dim everything else when locked, revealing, or showing feedback
  const isFocusMode = gameState.status === 'locked' || gameState.status === 'revealing' || gameState.status === 'feedback';
  const focusClass = isFocusMode ? "opacity-30 blur-sm transition-all duration-1000" : "transition-all duration-500";

  return (
    <>
      <BackgroundEffects />
      
      {gameState.status === 'feedback' && gameState.selectedAnswer !== null && (
        <HostFeedback 
            isCorrect={gameState.selectedAnswer === currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            correctAnswerText={currentQuestion.answers[currentQuestion.correctAnswer]}
            onNext={handleFeedbackNext}
        />
      )}

      <div className="relative z-10 min-h-screen flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-7xl mx-auto">
        <Modal 
          isOpen={modalState.isOpen} 
          title={modalState.type === 'phone' ? 'Bel een Vriend' : 'Vraag het Publiek'}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
        >
          {modalState.content}
        </Modal>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
          
          {/* Top UI */}
          <div className={`flex justify-between items-start mb-4 md:mb-8 ${isFocusMode ? 'opacity-20' : ''} transition-opacity duration-500`}>
              <div className="flex flex-col gap-2">
                  <div className="block md:hidden">
                      <div className="text-xs text-blue-300">VRAAG {gameState.currentQuestionIndex + 1}/15</div>
                      <div className="text-xl font-bold text-mil-gold">€ {currentPrizeAmount.toLocaleString('nl-NL')}</div>
                  </div>
                  {/* Stop Button */}
                  {gameState.status === 'playing' && (
                    <button 
                        onClick={stopGame}
                        className="text-xs md:text-sm border border-red-500/50 text-red-300 px-3 py-1 rounded hover:bg-red-900/50 transition-colors"
                    >
                        STOPPEN (€ {walkAwayAmount.toLocaleString('nl-NL')})
                    </button>
                  )}
              </div>
              <div className="ml-auto md:mx-auto">
                   <Lifelines gameState={gameState} onUseLifeline={useLifeline} />
              </div>
          </div>

          {/* Question Container */}
          <div className={`relative mb-8 md:mb-16 mx-4 ${isFocusMode ? '' : ''}`}>
              <div className={`absolute top-full left-1/2 w-0.5 h-8 md:h-16 bg-mil-gold/50 -translate-x-1/2 ${focusClass}`}></div>
              <div className={`absolute top-full left-0 w-full h-8 md:h-16 border-l border-r border-transparent ${focusClass}`}>
                   <div className="absolute bottom-0 left-[25%] w-0.5 h-full bg-mil-gold/30"></div>
                   <div className="absolute bottom-0 left-[75%] w-0.5 h-full bg-mil-gold/30"></div>
              </div>

              <div className={`relative bg-gradient-to-b from-slate-900 to-blue-950 border-2 border-slate-600 rounded-full min-h-[120px] flex items-center justify-center px-8 md:px-16 py-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20`}>
                  <h2 className="text-xl md:text-3xl font-medium leading-relaxed text-white">
                      {currentQuestion.question}
                  </h2>
              </div>
          </div>

          {/* Answers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-6 w-full px-2">
            {currentQuestion.answers.map((answer, index) => {
              
              let visualState: 'default' | 'selected' | 'correct' | 'wrong' | 'hidden' = 'default';
              let isDimmed = false;

              // Logic for visual states based on Game Phases
              if (gameState.eliminatedAnswers.includes(index)) {
                visualState = 'hidden';
              } else if (gameState.status === 'locked') {
                  // Phase 1: User locked in
                  if (gameState.selectedAnswer === index) {
                      visualState = 'selected';
                  } else {
                      isDimmed = true; // Dim unselected answers
                  }
              } else if (gameState.status === 'revealing' || gameState.status === 'feedback') {
                  // Phase 2 & 3: Show result (Keep showing result during feedback)
                  if (index === currentQuestion.correctAnswer) {
                      visualState = 'correct'; // Always show green for correct
                  } else if (gameState.selectedAnswer === index) {
                      visualState = 'wrong'; // Show red if user picked this and it's wrong
                  } else {
                      isDimmed = true;
                  }
              } else if (gameState.status === 'gameover' && index === currentQuestion.correctAnswer) {
                  // Show missed answer on game over
                  visualState = 'correct';
                  isDimmed = false;
              }
              
              // Fallback for click feedback while 'playing'
              if (gameState.status === 'playing' && gameState.selectedAnswer === index) {
                  visualState = 'selected';
              }

              return (
                <AnswerButton
                  key={index}
                  label={labelMap[index]}
                  text={answer}
                  state={visualState}
                  disabled={!canInteract}
                  dimmed={isDimmed}
                  onClick={() => handleAnswerClick(index)}
                />
              );
            })}
          </div>
        </div>

        {/* Ladder (Desktop) */}
        <div className={`hidden md:flex items-center justify-center pl-4 border-l border-white/10 ${focusClass}`}>
          <MoneyLadder currentQuestionIndex={gameState.currentQuestionIndex} />
        </div>
      </div>
    </>
  );
};

export default App;