import React from 'react';

interface AnswerButtonProps {
  label: string; // A, B, C, D
  text: string;
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'hidden';
  onClick: () => void;
  disabled: boolean;
  dimmed?: boolean;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ label, text, state, onClick, disabled, dimmed }) => {
  if (state === 'hidden') {
    return <div className="invisible h-16 md:h-20 w-full" />;
  }

  // Define gradients for the "Inner" part
  let innerBg = "bg-gradient-to-b from-slate-900 to-slate-800";
  let textColor = "text-white";
  let labelColor = "text-mil-gold";
  
  // Define border classes (using the CSS classes from index.html)
  let borderClass = "metallic-silver opacity-60"; // Default silverish

  if (state === 'default') {
    borderClass = "metallic-silver";
  }

  if (state === 'selected') {
    innerBg = "bg-orange-500 animate-pulse";
    borderClass = "metallic-gold shadow-[0_0_20px_rgba(251,191,36,0.6)]";
    textColor = "text-black";
    labelColor = "text-white";
  }

  if (state === 'correct') {
    innerBg = "bg-green-600 animate-[pulse_0.5s_ease-in-out_infinite]";
    borderClass = "metallic-gold shadow-[0_0_30px_rgba(34,197,94,0.8)]";
    textColor = "text-white";
    labelColor = "text-white";
  }

  if (state === 'wrong') {
    innerBg = "bg-mil-gold-dark"; // Using the dark gold/brown for wrong
    borderClass = "metallic-silver";
    textColor = "text-white";
    labelColor = "text-white";
  }

  // Hover state (only if default and enabled)
  const hoverClass = (!disabled && state === 'default') ? "group-hover:brightness-125" : "";
  const opacityClass = dimmed ? "opacity-30 blur-[1px] grayscale" : "opacity-100";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full h-16 md:h-20 flex items-center px-10 md:px-14 group transition-all duration-500
        ${!disabled && 'active:scale-95'}
        ${opacityClass}
      `}
    >
        {/* Hexagon Border Layer (The metallic part) */}
        {/* We use two side triangles and a center block to fake the hex shape efficiently with CSS gradients */}
        
        {/* Center Block Border */}
        <div className={`absolute inset-0 mx-5 md:mx-7 ${borderClass} z-0 transition-all duration-300`}></div>
        {/* Left Cap Border */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 md:w-7 h-full ${borderClass} z-0`}
             style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
        {/* Right Cap Border */}
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 md:w-7 h-full ${borderClass} z-0`}
             style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>


        {/* Inner Content Layer (The dark blue part) - Slightly smaller to reveal border */}
        
        {/* Center Block Inner */}
        <div className={`absolute inset-y-[2px] inset-x-[22px] md:inset-x-[30px] ${innerBg} ${hoverClass} z-10 transition-colors duration-300`}></div>
        {/* Left Cap Inner */}
        <div className={`absolute left-[2px] top-1/2 -translate-y-1/2 w-5 md:w-7 h-[calc(100%-4px)] ${innerBg} ${hoverClass} z-10`}
             style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
        {/* Right Cap Inner */}
        <div className={`absolute right-[2px] top-1/2 -translate-y-1/2 w-5 md:w-7 h-[calc(100%-4px)] ${innerBg} ${hoverClass} z-10`}
             style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>


         {/* Text Content */}
         <div className={`relative z-20 flex w-full items-center gap-4 ${textColor}`}>
             <span className={`font-bold text-xl md:text-2xl ${labelColor} font-serif`}>{label}:</span>
             <span className={`font-medium text-sm md:text-lg text-left leading-tight`}>{text}</span>
         </div>
         
         {/* Shiny Line Decoration */}
         <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 z-20 pointer-events-none"></div>
    </button>
  );
};

export default AnswerButton;