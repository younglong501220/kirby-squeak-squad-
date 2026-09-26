import React from 'react';
import { ABILITIES } from '../utils/constants';
import { Sparkles, Trophy, Flame, Snowflake, Zap, Heart, BookOpen, X } from 'lucide-react';

interface CollectionModalProps {
  unlockedScrolls: string[];
  cakePieces: number;
  maxCakePieces: number;
  onClose: () => void;
  cakeImageUrl?: string;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  unlockedScrolls,
  cakePieces,
  maxCakePieces,
  onClose,
  cakeImageUrl,
}) => {
  const fusedList = [
    {
      name: '烈焰劍 🔥⚔️',
      recipe: '🔥 火焰 + ⚔️ 劍士',
      desc: '揮擊伴隨烈焰風暴，焚燒枯木藤蔓、引燃導火線！',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
    },
    {
      name: '寒冰劍 ❄️⚔️',
      recipe: '❄️ 寒冰 + ⚔️ 劍士',
      desc: '揮出極霜冰月牙，斬擊水面瞬間凝結大片冰面踏板！',
      icon: <Snowflake className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: '雷霆劍 ⚡⚔️',
      recipe: '⚡ 電擊 + ⚔️ 劍士',
      desc: '連鎖十萬伏特閃電斬，遠程激發古代電力開關！',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
    },
    {
      name: '火焰爆彈 🔥💣',
      recipe: '🔥 火焰 + 💣 炸彈',
      desc: '劇烈爆炸並在地面留存持久火海重創敵人！',
      icon: <Flame className="w-5 h-5 text-red-500" />,
    },
    {
      name: '寒冰爆彈 ❄️💣',
      recipe: '❄️ 寒冰 + 💣 炸彈',
      desc: '絕對零度爆破，大範圍將周遭所有雜兵瞬間凍結成冰！',
      icon: <Snowflake className="w-5 h-5 text-sky-400" />,
    },
    {
      name: '全滿番茄 🍅',
      recipe: '🍒 櫻桃/蛋糕 + 🍒 美食',
      desc: '雙倍糖分提煉，瞬間全滿 100% 生命！',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Section Title */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-pink-400" />
          <div>
            <h2 className="text-xl font-bold text-white">波波的秘寶收藏室 (Treasury)</h2>
            <p className="text-xs text-slate-400">
              記錄已奪回的奧義秘卷、究極草莓千層酥與胃袋合成圖鑑
            </p>
          </div>
        </div>

        {/* Cake Progress Card */}
        <div className="p-4 bg-gradient-to-r from-pink-950/60 to-purple-950/60 rounded-2xl border border-pink-500/40 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 bg-pink-900/40 rounded-xl border border-pink-500/40 flex items-center justify-center shrink-0 overflow-hidden">
            {cakeImageUrl ? (
              <img
                src={cakeImageUrl}
                alt="Ultimate Strawberry Cake"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🍰</span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
              <span className="font-bold text-sm text-pink-200">
                【究極草莓千層酥】奪回進度
              </span>
              <span className="font-mono text-xs font-bold text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/40">
                {cakePieces}/{maxCakePieces} 碎片
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              波波最心愛的下午茶甜點被怪盜團首領搶走！在關卡中搶得黃金寶箱奪回每一塊碎片！
            </p>
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                style={{ width: `${(cakePieces / maxCakePieces) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ability Scrolls Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            能力奧義秘卷 (Secret Scrolls)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-xl border transition-all ${
                unlockedScrolls.includes('Sword')
                  ? 'bg-slate-800/80 border-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-emerald-400">📜 劍士奧義秘卷</span>
                <span className="text-[10px] text-slate-400">第一關秘寶</span>
              </div>
              <p className="text-[11px] text-slate-300">
                滿血時揮劍可釋放飛行【劍氣波】，並解鎖迴旋衝刺斬擊！
              </p>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${
                unlockedScrolls.includes('Fire')
                  ? 'bg-slate-800/80 border-orange-500/50'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-orange-400">📜 火焰奧義秘卷</span>
                <span className="text-[10px] text-slate-400">第二關秘寶</span>
              </div>
              <p className="text-[11px] text-slate-300">
                烈焰衝刺進化為【不死鳥衝擊】，撞擊時引發劇烈火風暴！
              </p>
            </div>
          </div>
        </div>

        {/* Fusion Catalog */}
        <div>
          <h3 className="text-sm font-bold text-pink-300 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-4 h-4 text-pink-400" />
            【多洛奇團】胃袋合成全圖鑑
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {fusedList.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5"
              >
                <div className="p-2 bg-slate-900 rounded-lg shrink-0 border border-slate-800">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-200">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 mb-0.5">{item.recipe}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
