import React from 'react';

interface ChequeProps {
  amount: number;
  playername?: string;
}

const Cheque: React.FC<ChequeProps> = ({ amount, playername = "De Deelnemer" }) => {
  const date = new Date().toLocaleDateString('nl-NL');

  return (
    <div className="relative bg-[#fdfbf7] text-black p-4 md:p-8 rounded shadow-2xl max-w-2xl w-full mx-auto transform rotate-1 border-4 border-double border-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="border-2 border-slate-800 p-4 md:p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="font-serif font-bold text-xl uppercase tracking-widest text-slate-700">
            Bank of Weekend Miljonairs
          </div>
          <div className="font-mono text-sm text-slate-500">
            DATUM: {date}
          </div>
        </div>

        {/* Pay Line */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-end gap-4">
            <span className="font-serif text-sm uppercase whitespace-nowrap mb-1">Betaal aan:</span>
            <div className="flex-1 border-b-2 border-slate-800 font-handwriting text-3xl md:text-5xl px-4 text-mil-blue-light">
              {playername}
            </div>
          </div>
          
          <div className="flex items-end gap-4">
            <span className="font-serif text-sm uppercase whitespace-nowrap mb-1">Het bedrag van:</span>
            <div className="flex-1 border-b-2 border-slate-800 font-handwriting text-2xl md:text-4xl px-4 text-mil-blue-light">
               € {amount.toLocaleString('nl-NL')},-
            </div>
            <div className="border-2 border-slate-800 bg-slate-100 px-4 py-2 font-mono font-bold text-xl md:text-2xl min-w-[150px] text-right">
              € {amount.toLocaleString('nl-NL')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12">
            <div className="font-mono text-xs text-slate-400">
                001234 : 56789000 : 9988
            </div>
            <div className="flex flex-col items-center">
                <div className="font-handwriting text-3xl text-slate-800 -rotate-6">Robert ten Brink</div>
                <div className="border-t border-slate-800 w-48 mt-1"></div>
                <span className="text-xs uppercase font-serif mt-1">Handtekening</span>
            </div>
        </div>
        
        {/* Shiny Seal */}
        <div className="absolute top-16 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-80 flex items-center justify-center shadow-lg border-4 border-yellow-200 border-double">
            <span className="font-bold text-yellow-900 text-xs text-center leading-tight uppercase rotate-12">Gecertificeerd Winnaar</span>
        </div>

      </div>
    </div>
  );
};

export default Cheque;