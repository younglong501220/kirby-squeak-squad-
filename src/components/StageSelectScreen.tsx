import React from 'react';
import { STAGES } from '../utils/constants';
import { Play, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageSelectScreenProps {
  onSelectStage: (stageId: number) => void;
  clearedStages: number[];
  unlockedScrolls: string[];
  cakePieces: number;
}

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({
  onSelectStage,
  clearedStages,
  unlockedScrolls,
  cakePieces,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-white">選擇冒險關卡</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          探索三大主題關卡，解開屬性謎題，擊退怪盜旅團奪回所有失落的秘寶！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STAGES.map((stg) => {
          const isCleared = clearedStages.includes(stg.id);
          const isUnlocked = stg.id === 1 || clearedStages.includes(stg.id - 1);

          return (
            <div
              key={stg.id}
              className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 ${
                isUnlocked
                  ? 'bg-slate-900 border-slate-700/80 hover:border-pink-500/80 hover:shadow-xl hover:shadow-pink-500/10'
                  : 'bg-slate-950/60 border-slate-800 opacity-50 pointer-events-none'
              }`}
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-pink-400 bg-pink-950/80 px-2.5 py-0.5 rounded-full border border-pink-500/40">
                    STAGE {stg.id}
                  </span>
                  {isCleared && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> 已奪回秘寶
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">{stg.title}</h3>
                <span className="text-xs font-medium text-slate-400 block mb-3">
                  {stg.subtitle}
                </span>

                {/* Stage Theme & Features */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-4 text-xs space-y-1.5">
                  <div className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    秘寶獎勵：{stg.chestReward.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stg.id === 1 && '💡 提示：使用火焰或烈焰劍燒毀阻擋寶箱的枯木藤蔓！'}
                    {stg.id === 2 && '💡 提示：用寒冰凍結深水池當作橋樑，用雷霆激活電極開關！'}
                    {stg.id === 3 && '💡 提示：直面怪盜首領男爵，奪回被偷走的究極草莓千層酥！'}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playJump();
                  onSelectStage(stg.id);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md active:scale-95'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <span>進入關卡</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
