import React, { useState } from 'react';
import { StomachBubble, AbilityType } from '../types/game';
import { evaluateFusion, FusionResult } from '../utils/fusion';
import { sound } from '../utils/audio';
import { Sparkles, Utensils, HelpCircle, PackageOpen, Zap, Flame, Snowflake, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BellyScreenProps {
  bubbles: StomachBubble[];
  currentAbility: AbilityType;
  playerHp: number;
  maxHp: number;
  onEquipAbility: (ability: AbilityType) => void;
  onEatFood: (healAmount: number) => void;
  onUseSuperStar: () => void;
  onFuseBubbles: (sourceIndex: number, targetIndex: number, result: StomachBubble) => void;
  onSpitBubble: (index: number) => void;
  onStoreCurrentAbility: () => void;
  isHeistActive: boolean;
}

export const BellyScreen: React.FC<BellyScreenProps> = ({
  bubbles,
  currentAbility,
  playerHp,
  maxHp,
  onEquipAbility,
  onEatFood,
  onUseSuperStar,
  onFuseBubbles,
  onSpitBubble,
  onStoreCurrentAbility,
  isHeistActive,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverTargetIndex, setHoverTargetIndex] = useState<number | null>(null);
  const [fusionPreview, setFusionPreview] = useState<FusionResult | null>(null);
  const [showRecipes, setShowRecipes] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    sound.playInhale();
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    if (hoverTargetIndex !== targetIndex) {
      setHoverTargetIndex(targetIndex);
      const itemA = bubbles[draggedIndex];
      const itemB = bubbles[targetIndex];
      if (itemA && itemB) {
        const preview = evaluateFusion(itemA, itemB);
        setFusionPreview(preview);
      }
    }
  };

  const handleDragLeave = () => {
    setHoverTargetIndex(null);
    setFusionPreview(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setHoverTargetIndex(null);
      setFusionPreview(null);
      return;
    }

    const itemA = bubbles[draggedIndex];
    const itemB = bubbles[targetIndex];

    if (itemA && itemB) {
      const evaluation = evaluateFusion(itemA, itemB);
      if (evaluation.canFuse && evaluation.resultBubble) {
        sound.playFusionJingle();
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.85 },
        });
        showToast(`✨ 成功融合出【${evaluation.name}】！`);
        onFuseBubbles(draggedIndex, targetIndex, evaluation.resultBubble);
      } else {
        showToast(evaluation.description);
      }
    }

    setDraggedIndex(null);
    setHoverTargetIndex(null);
    setFusionPreview(null);
  };

  const handleBubbleClick = (index: number) => {
    const item = bubbles[index];
    if (!item) return;

    if (item.isSpecialChest) {
      showToast('👑 這是關卡秘寶！通關時帶出即可打開寶箱獲得獎勵！');
      return;
    }

    if (item.healAmount) {
      sound.playBubblePop();
      onEatFood(item.healAmount);
      onSpitBubble(index); // consumes
      showToast(`💖 吃下了 ${item.title}，恢復了 ${item.healAmount} HP！`);
      return;
    }

    if (item.ability === 'SuperStar') {
      sound.playBombBoom();
      onUseSuperStar();
      onSpitBubble(index);
      showToast('🌟 釋放了大超星！全場敵人遭受星之毀滅震盪！');
      return;
    }

    if (item.ability) {
      sound.playBubblePop();
      onEquipAbility(item.ability);
      showToast(`⚡ 裝備了能力【${item.title}】！`);
      return;
    }
  };

  // Quick auto-fuse button
  const handleQuickFuse = () => {
    if (bubbles.length < 2) {
      showToast('胃袋裡至少需要 2 個氣泡才能進行融合！');
      return;
    }

    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const evalRes = evaluateFusion(bubbles[i], bubbles[j]);
        if (evalRes.canFuse && evalRes.resultBubble) {
          sound.playFusionJingle();
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
          showToast(`✨ 自動融合成功：【${evalRes.name}】！`);
          onFuseBubbles(i, j, evalRes.resultBubble);
          return;
        }
      }
    }
    showToast('目前胃袋中沒有符合融合配方的要素！');
  };

  const maxSlots = 5;
  const slots = Array.from({ length: maxSlots }, (_, i) => bubbles[i] || null);

  return (
    <div className="w-full bg-slate-900 border-t-4 border-slate-700 p-3 sm:p-4 rounded-b-2xl shadow-2xl relative select-none">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
          <h3 className="font-bold text-sm sm:text-base text-pink-300 tracking-wide flex items-center gap-1.5">
            波波的胃袋空間 (DS 下螢幕)
          </h3>
          <span className="text-xs text-slate-400">
            {bubbles.length}/{maxSlots} 氣泡
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {currentAbility !== 'Normal' && (
            <button
              onClick={() => {
                if (bubbles.length >= maxSlots) {
                  showToast('胃袋氣泡已滿，無法再收納能力！');
                  return;
                }
                sound.playSwallow();
                onStoreCurrentAbility();
                showToast(`已將當前能力收存為氣泡！`);
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500/40 transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
              title="將頭頂戴著的能力卸下，裝進肚子氣泡裡"
            >
              <PackageOpen className="w-3.5 h-3.5" />
              收納能力 (C)
            </button>
          )}

          <button
            onClick={handleQuickFuse}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-600/80 hover:bg-amber-500 text-white rounded-lg border border-amber-400/40 transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
            title="自動尋找可融合的一對氣泡"
          >
            <Sparkles className="w-3.5 h-3.5" />
            融合 (E)
          </button>

          <button
            onClick={() => setShowRecipes((prev) => !prev)}
            className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            合成表
          </button>
        </div>
      </div>

      {/* Heist Warning Bar if active */}
      {isHeistActive && (
        <div className="mb-3 px-3 py-1.5 bg-rose-950/80 border border-rose-500/50 rounded-lg flex items-center justify-between text-xs text-rose-200 animate-pulse">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            【怪盜松鼠旅團正在搶奪秘寶！】
          </div>
          <span className="text-[11px] text-rose-300">擊退盜賊，保護黃金寶箱！</span>
        </div>
      )}

      {/* Bubble Slots Container */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 relative">
        {slots.map((item, idx) => {
          const isTarget = hoverTargetIndex === idx;
          const isDragging = draggedIndex === idx;

          return (
            <div
              key={idx}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              className={`aspect-square relative rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                isTarget
                  ? 'border-2 border-dashed border-amber-400 bg-amber-950/40 scale-105'
                  : item
                  ? 'bg-slate-800/60 border-2 border-slate-600/60 shadow-inner hover:border-pink-400'
                  : 'bg-slate-900/40 border-2 border-dashed border-slate-800'
              }`}
            >
              {item ? (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onClick={() => handleBubbleClick(idx)}
                  className={`w-full h-full rounded-full cursor-pointer flex flex-col items-center justify-center p-1 relative overflow-hidden transition-transform active:scale-95 ${
                    isDragging ? 'opacity-40' : 'opacity-100'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${item.color}cc, ${item.accentColor}dd 85%)`,
                    boxShadow: `0 0 14px ${item.color}55, inset 0 2px 4px rgba(255,255,255,0.4)`,
                  }}
                  title="點擊使用/裝備，拖曳至另一氣泡進行融合"
                >
                  {/* Glossy Bubble Glare */}
                  <div className="absolute top-1 left-2 w-3 h-1.5 sm:w-4 sm:h-2 bg-white/40 rounded-full rotate-[-25deg] blur-[0.5px]" />
                  <div className="text-xl sm:text-2xl drop-shadow-md select-none">{item.icon}</div>
                  <span className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight truncate max-w-[90%] drop-shadow">
                    {item.title}
                  </span>

                  {/* Spit button in corner */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playSpit();
                      onSpitBubble(idx);
                      showToast(`吐出了氣泡：${item.title}`);
                    }}
                    className="absolute bottom-1 right-1 w-4 h-4 bg-black/50 hover:bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center leading-none"
                    title="吐出丟棄"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-slate-600 font-medium">空槽 {idx + 1}</div>
              )}

              {/* Slot Number Badge */}
              <span className="absolute -top-1 -right-1 text-[9px] font-mono text-slate-400 bg-slate-950 px-1 rounded-full border border-slate-800">
                #{idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Realtime Fusion Preview Banner */}
      {fusionPreview && (
        <div
          className={`mt-2 px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
            fusionPreview.canFuse
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
              : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{fusionPreview.name}</span>
            <span className="text-slate-400">|</span>
            <span className="text-[11px] text-slate-300">{fusionPreview.description}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">放開融合</span>
        </div>
      )}

      {/* Floating In-App Toast */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-slate-800/95 text-slate-100 text-xs px-3 py-1.5 rounded-full border border-pink-500/50 shadow-lg pointer-events-none animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Recipe Book Drawer / Modal */}
      {showRecipes && (
        <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              【多洛奇團】胃袋合成秘方全典 (Fusion Recipes)
            </h4>
            <button
              onClick={() => setShowRecipes(false)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded"
            >
              關閉
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 烈焰火劍 (Fire Sword)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">🔥 火焰 + ⚔️ 劍士</div>
              <div className="text-[10px] text-slate-500">揮砍附帶大火浪，燒毀枯木藤蔓、點燃導火線！</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-cyan-400 flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5" /> 寒冰霜劍 (Ice Sword)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">❄️ 寒冰 + ⚔️ 劍士</div>
              <div className="text-[10px] text-slate-500">揮舞冰月牙，斬擊水面瞬間凍結成冰台渡海！</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-yellow-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 雷霆電劍 (Thunder Sword)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">⚡ 電擊 + ⚔️ 劍士</div>
              <div className="text-[10px] text-slate-500">連鎖閃電擊穿群體，劍氣可遠程啟動古代電極！</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-red-400 flex items-center gap-1">
                🔥💣 火焰爆彈 (Fire Bomb)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">🔥 火焰 + 💣 炸彈</div>
              <div className="text-[10px] text-slate-500">爆炸後在地面留下持久烈焰，大面積重創。</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-sky-400 flex items-center gap-1">
                ❄️💣 寒冰爆彈 (Ice Bomb)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">❄️ 寒冰 + 💣 炸彈</div>
              <div className="text-[10px] text-slate-500">零度爆發！半徑內所有小怪瞬間凝結成大冰塊！</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <div className="font-bold text-rose-400 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" /> 全滿番茄 (Maxim Tomato)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">🍒 櫻桃/蛋糕 + 🍒 任何美食</div>
              <div className="text-[10px] text-slate-500">雙重美味融合，恢復 100% 全部生命值！</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
