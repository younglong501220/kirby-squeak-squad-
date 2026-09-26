import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, PackageOpen } from 'lucide-react';

interface VirtualGamepadProps {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onStoreAbility: () => void;
  onQuickFuse: () => void;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({
  onKeyDown,
  onKeyUp,
  onStoreAbility,
  onQuickFuse,
}) => {
  const triggerKey = (key: string) => {
    onKeyDown(key);
    setTimeout(() => onKeyUp(key), 120);
  };

  return (
    <div className="w-full flex items-center justify-between gap-4 mt-3 px-2 py-2 bg-slate-950/60 rounded-xl border border-slate-800 md:hidden select-none">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-1.5 w-32">
        <div />
        <button
          onTouchStart={() => onKeyDown('w')}
          onTouchEnd={() => onKeyUp('w')}
          onMouseDown={() => onKeyDown('w')}
          onMouseUp={() => onKeyUp('w')}
          className="h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center border border-slate-700 font-bold"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onTouchStart={() => onKeyDown('a')}
          onTouchEnd={() => onKeyUp('a')}
          onMouseDown={() => onKeyDown('a')}
          onMouseUp={() => onKeyUp('a')}
          className="h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center border border-slate-700 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onTouchStart={() => onKeyDown('s')}
          onTouchEnd={() => onKeyUp('s')}
          onMouseDown={() => onKeyDown('s')}
          onMouseUp={() => onKeyUp('s')}
          className="h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center border border-slate-700 font-bold"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        <button
          onTouchStart={() => onKeyDown('d')}
          onTouchEnd={() => onKeyUp('d')}
          onMouseDown={() => onKeyDown('d')}
          onMouseUp={() => onKeyUp('d')}
          className="h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center border border-slate-700 font-bold"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onTouchStart={() => onKeyDown('j')}
          onTouchEnd={() => onKeyUp('j')}
          onMouseDown={() => onKeyDown('j')}
          onMouseUp={() => onKeyUp('j')}
          className="w-14 h-14 rounded-full bg-rose-600 active:bg-rose-500 text-white font-black text-sm flex flex-col items-center justify-center border-2 border-rose-400 shadow-lg active:scale-95"
        >
          <span>J</span>
          <span className="text-[9px] font-normal">吸入/攻擊</span>
        </button>

        <button
          onTouchStart={() => onKeyDown('w')}
          onTouchEnd={() => onKeyUp('w')}
          onMouseDown={() => onKeyDown('w')}
          onMouseUp={() => onKeyUp('w')}
          className="w-14 h-14 rounded-full bg-blue-600 active:bg-blue-500 text-white font-black text-sm flex flex-col items-center justify-center border-2 border-blue-400 shadow-lg active:scale-95"
        >
          <span>W</span>
          <span className="text-[9px] font-normal">跳躍/飄浮</span>
        </button>

        <button
          onClick={() => triggerKey('s')}
          className="w-12 h-12 rounded-full bg-emerald-700 active:bg-emerald-600 text-white font-bold text-xs flex flex-col items-center justify-center border border-emerald-500 shadow active:scale-95"
        >
          <span>S</span>
          <span className="text-[8px] font-normal">吞入胃袋</span>
        </button>
      </div>
    </div>
  );
};
