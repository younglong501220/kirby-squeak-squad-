import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { StageConfig } from '../types/game';
import { Sparkles, Trophy, ArrowRight, Heart } from 'lucide-react';

interface ChestOpeningModalProps {
  stageConfig: StageConfig;
  hasGoldenChest: boolean;
  hasSilverChest: boolean;
  onProceed: () => void;
  cakeImageUrl?: string;
}

export const ChestOpeningModal: React.FC<ChestOpeningModalProps> = ({
  stageConfig,
  hasGoldenChest,
  hasSilverChest,
  onProceed,
  cakeImageUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChest = () => {
    setIsOpen(true);
    sound.playVictoryFanfare();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 300);
  };

  const reward = stageConfig.chestReward;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative light aura */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Stage Clear · 關卡結算秘寶開箱
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 mb-4">
            {stageConfig.title} 順利通關！
          </h2>

          {hasGoldenChest ? (
            <div>
              {!isOpen ? (
                <div className="py-6 flex flex-col items-center">
                  <div className="w-28 h-28 bg-gradient-to-b from-amber-400 to-amber-600 rounded-2xl border-4 border-amber-300 shadow-xl flex items-center justify-center text-5xl mb-4 animate-bounce">
                    👑📦
                  </div>
                  <p className="text-sm text-slate-300 mb-6">
                    成功擊退怪盜松鼠旅團，安全保全了關卡【黃金大秘寶】！
                  </p>
                  <button
                    onClick={handleOpenChest}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    揭開大秘寶寶箱！
                  </button>
                </div>
              ) : (
                <div className="py-4 animate-fade-in">
                  <div className="w-28 h-28 mx-auto mb-3 relative flex items-center justify-center">
                    {reward.type === 'cake' && cakeImageUrl ? (
                      <img
                        src={cakeImageUrl}
                        alt="Ultimate Strawberry Cake"
                        referrerPolicy="no-referrer"
                        className="w-28 h-28 object-contain drop-shadow-xl animate-pulse"
                      />
                    ) : (
                      <div className="text-6xl drop-shadow-lg">
                        {reward.type === 'scroll' ? '📜✨' : '🍰👑'}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/40 mb-5 text-left">
                    <div className="flex items-center gap-2 font-bold text-amber-400 text-base mb-1">
                      <Trophy className="w-4 h-4" />
                      獲得：{reward.title}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{reward.description}</p>

                    {hasSilverChest && (
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
                        <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                        銀色秘寶：生命上限強化 +10 HP！
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onProceed}
                    className="w-full py-3 bg-slate-100 hover:bg-white text-slate-950 font-bold text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    確認收下並繼續 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6">
              <div className="text-5xl mb-3">💨</div>
              <h3 className="font-bold text-base text-slate-200 mb-1">
                黃金秘寶被怪盜團擄走了！
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                這次很可惜沒能把大寶箱守住。不過你順利抵達了終點！下次記得在盜賊逃向地洞前擊倒他們搶回！
              </p>
              <button
                onClick={onProceed}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                前往下一關
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
