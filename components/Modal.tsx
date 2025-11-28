import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-mil-gold rounded-lg shadow-[0_0_30px_rgba(251,191,36,0.3)] max-w-md w-full p-6 relative">
        <h3 className="text-2xl font-bold text-mil-gold mb-4 border-b border-white/20 pb-2">{title}</h3>
        <div className="text-white text-lg mb-6">
          {children}
        </div>
        <button 
          onClick={onClose}
          className="w-full py-2 bg-mil-blue-light hover:bg-blue-700 text-white font-bold rounded border border-white/30"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
};

export default Modal;