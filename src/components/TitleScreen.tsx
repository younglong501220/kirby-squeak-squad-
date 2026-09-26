import React from 'react';
import { Play, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  onStart: () => void;
  onOpenTreasury: () => void;
  onOpenHelp: () => void;
  bannerImageUrl: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenTreasury,
  onOpenHelp,
  bannerImageUrl,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Banner / Cover Art */}
      <div className="w-full aspect-[16/9] max-h-[380px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative mb-8 group bg-slate-900">
        <img
          src={bannerImageUrl}
          alt="Kirby Squeak Squad Title"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold w-fit mb-2 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> 致敬《星之卡比 參上！多洛奇團》經典巨作
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-2">
            星之卡比 參上！怪盜團
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl drop-shadow leading-relaxed">
            享受下午茶的波波發現「究極草莓千層酥」被神偷怪盜松鼠旅團搶走了！
            掌握經典三大靈魂：<span className="text-pink-300 font-bold">【胃袋物品欄】</span>、
            <span className="text-amber-300 font-bold">【胃袋屬性合成】</span>與
            <span className="text-rose-300 font-bold">【黃金秘寶爭奪戰】</span>！
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10 w-full max-w-md">
        <button
          onClick={() => {
            sound.playJump();
            onStart();
          }}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-pink-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          出發展開冒險
        </button>

        <button
          onClick={() => {
            sound.playBubblePop();
            onOpenTreasury();
          }}
          className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-pink-400" />
          秘寶收藏
        </button>

        <button
          onClick={() => {
            sound.playBubblePop();
            onOpenHelp();
          }}
          className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          操作說明
        </button>
      </div>

      {/* Three Pillars Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <div className="text-2xl mb-2">🫧</div>
          <h3 className="font-bold text-sm text-pink-300 mb-1">1. 胃袋儲存空間</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            長按吸入敵人或美食後，按 S 鍵吞入肚子，化為下螢幕 5 格氣泡，隨時取出裝備或回血！
          </p>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <div className="text-2xl mb-2">🔥⚔️</div>
          <h3 className="font-bold text-sm text-amber-300 mb-1">2. 胃袋屬性合成</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            將【火焰】與【劍士】拖曳融合為【烈焰劍】；【寒冰】與【劍士】合成【寒冰劍】！更有美食大補餐！
          </p>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <div className="text-2xl mb-2">👑🐿️</div>
          <h3 className="font-bold text-sm text-rose-300 mb-1">3. 怪盜秘寶爭奪</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            一旦撿起關卡黃金大寶箱，怪盜松鼠全員出動搶奪！被擊中寶箱會掉落，必須追殺盜賊奪回！
          </p>
        </div>
      </div>
    </div>
  );
};
