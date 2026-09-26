import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { GameView } from '../types/game';

interface HeaderProps {
  currentView: GameView;
  setCurrentView: (view: GameView) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTreasury: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isMuted,
  onToggleMute,
  onOpenTreasury,
  onOpenHelp,
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => setCurrentView('TITLE')}
        className="text-base sm:text-lg font-extrabold tracking-tight text-white hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <span className="text-xl">🌸</span>
        <span>星之卡比 參上！怪盜團</span>
      </button>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
        <button
          onClick={() => setCurrentView('STAGE_SELECT')}
          className="hover:text-slate-100 transition-colors cursor-pointer"
        >
          關卡冒險
        </button>
        <button
          onClick={onOpenTreasury}
          className="hover:text-slate-100 transition-colors cursor-pointer flex items-center gap-1"
        >
          秘寶收藏
        </button>
        <button
          onClick={onOpenHelp}
          className="hover:text-slate-100 transition-colors cursor-pointer flex items-center gap-1"
        >
          玩法指引
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMute}
          className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          title={isMuted ? '開啟音效' : '靜音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {currentView === 'PLAYING' ? (
          <button
            onClick={() => setCurrentView('STAGE_SELECT')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            退出關卡
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('STAGE_SELECT')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            開始出發
          </button>
        )}
      </div>
    </header>
  );
};
