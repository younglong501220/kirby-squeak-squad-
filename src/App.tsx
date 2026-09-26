/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameView, PlayerState, AbilityType, ItemType, StomachBubble, StageConfig } from './types/game';
import { buildStage, StageData } from './utils/stageBuilder';
import { sound } from './utils/audio';
import { createBubbleFromItem } from './utils/fusion';
import { STAGES, ABILITIES } from './utils/constants';

import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { StageSelectScreen } from './components/StageSelectScreen';
import { ActionCanvas } from './components/ActionCanvas';
import { BellyScreen } from './components/BellyScreen';
import { VirtualGamepad } from './components/VirtualGamepad';
import { ChestOpeningModal } from './components/ChestOpeningModal';
import { CollectionModal } from './components/CollectionModal';
import { HelpModal } from './components/HelpModal';
import { RotateCcw, ArrowRight } from 'lucide-react';

import TITLE_BANNER_URL from './assets/images/game_title_banner_1790440015536.jpg';
import CAKE_TREASURE_URL from './assets/images/game_cake_treasure_1790440028699.jpg';
import STAGE_BG_URL from './assets/images/game_bg_green_hills_1790440039874.jpg';

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('TITLE');
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [stageData, setStageData] = useState<StageData>(() => buildStage(1));

  // Progression & Save State
  const [clearedStages, setClearedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('kirby_cleared_stages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlockedScrolls, setUnlockedScrolls] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kirby_scrolls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cakePieces, setCakePieces] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kirby_cake_pieces');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHeistActive, setIsHeistActive] = useState<boolean>(false);

  // Modals
  const [showChestModal, setShowChestModal] = useState<boolean>(false);
  const [chestModalData, setChestModalData] = useState<{ hasGolden: boolean; hasSilver: boolean }>({
    hasGolden: false,
    hasSilver: false,
  });
  const [showTreasury, setShowTreasury] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Initial Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 80,
    y: 340,
    w: 36,
    h: 36,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    facing: 1,
    isGrounded: true,
    isFloating: false,
    floatFlapTimer: 0,
    isCrouching: false,
    isSliding: false,
    slideTimer: 0,
    isInhaling: false,
    inhaleTimer: 0,
    mouthItem: null,
    currentAbility: 'Normal',
    stomach: [
      createBubbleFromItem('Sword'),
      createBubbleFromItem('Fire'),
      createBubbleFromItem('FoodCherry'),
    ],
    carryingChest: false,
    invincibleTimer: 0,
    attackTimer: 0,
    attackType: null,
    score: 0,
    isAlive: true,
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kirby_cleared_stages', JSON.stringify(clearedStages));
      localStorage.setItem('kirby_scrolls', JSON.stringify(unlockedScrolls));
      localStorage.setItem('kirby_cake_pieces', JSON.stringify(cakePieces));
    } catch {
      // ignore
    }
  }, [clearedStages, unlockedScrolls, cakePieces]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Start specific stage
  const handleSelectStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setStageData(buildStage(stageId));
    setIsHeistActive(false);
    setIsGameOver(false);
    setPlayerState((prev) => ({
      ...prev,
      hp: prev.maxHp,
      carryingChest: false,
      mouthItem: null,
      isAlive: true,
    }));
    setCurrentView('PLAYING');
  };

  // Belly handlers
  const handleAddBubble = useCallback((itemType: ItemType): boolean => {
    let added = false;
    setPlayerState((prev) => {
      if (prev.stomach.length >= 5) {
        return prev;
      }
      added = true;
      const newBubble = createBubbleFromItem(itemType);
      return {
        ...prev,
        stomach: [...prev.stomach, newBubble],
      };
    });
    return added;
  }, []);

  const handleEquipAbility = (ability: AbilityType) => {
    setPlayerState((prev) => ({
      ...prev,
      currentAbility: ability,
    }));
  };

  const handleEatFood = (healAmount: number) => {
    setPlayerState((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + healAmount),
    }));
  };

  const handleUseSuperStar = () => {
    // Super Star blast: wipes minor enemies handled in ActionCanvas
    setPlayerState((prev) => ({
      ...prev,
      hp: prev.maxHp,
      invincibleTimer: 180,
    }));
  };

  const handleFuseBubbles = (
    sourceIndex: number,
    targetIndex: number,
    result: StomachBubble
  ) => {
    setPlayerState((prev) => {
      const nextStomach = [...prev.stomach];
      const higherIdx = Math.max(sourceIndex, targetIndex);
      const lowerIdx = Math.min(sourceIndex, targetIndex);

      nextStomach.splice(higherIdx, 1);
      nextStomach.splice(lowerIdx, 1);
      nextStomach.push(result);

      return {
        ...prev,
        stomach: nextStomach,
      };
    });
  };

  const handleSpitBubble = (index: number) => {
    setPlayerState((prev) => {
      const nextStomach = [...prev.stomach];
      nextStomach.splice(index, 1);
      return {
        ...prev,
        stomach: nextStomach,
      };
    });
  };

  const handleStoreCurrentAbility = () => {
    setPlayerState((prev) => {
      if (prev.currentAbility === 'Normal' || prev.stomach.length >= 5) {
        return prev;
      }
      const bubble = createBubbleFromItem(prev.currentAbility);
      return {
        ...prev,
        currentAbility: 'Normal',
        stomach: [...prev.stomach, bubble],
      };
    });
  };

  // Stage clear handler
  const handleStageClear = (hasGoldenChest: boolean, hasSilverChest: boolean) => {
    setChestModalData({ hasGolden: hasGoldenChest, hasSilver: hasSilverChest });
    setShowChestModal(true);

    // Update progression
    if (!clearedStages.includes(currentStageId)) {
      setClearedStages((prev) => [...prev, currentStageId]);
    }

    if (hasGoldenChest) {
      const reward = stageData.config.chestReward;
      if (reward.type === 'scroll' && reward.abilityTarget) {
        if (!unlockedScrolls.includes(reward.abilityTarget)) {
          setUnlockedScrolls((prev) => [...prev, reward.abilityTarget!]);
        }
      } else if (reward.type === 'cake') {
        setCakePieces((prev) => Math.min(3, prev + 1));
      }
    }

    if (hasSilverChest) {
      setPlayerState((prev) => ({
        ...prev,
        maxHp: prev.maxHp + 10,
        hp: prev.maxHp + 10,
      }));
    }
  };

  const handleProceedAfterChest = () => {
    setShowChestModal(false);
    if (currentStageId < 3) {
      handleSelectStage(currentStageId + 1);
    } else {
      setCurrentView('STAGE_SELECT');
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  // Virtual Gamepad synthetic key events
  const handleVirtualKeyDown = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  const handleVirtualKeyUp = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (3 zones) */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenTreasury={() => setShowTreasury(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 w-full">
        {currentView === 'TITLE' && (
          <TitleScreen
            onStart={() => setCurrentView('STAGE_SELECT')}
            onOpenTreasury={() => setShowTreasury(true)}
            onOpenHelp={() => setShowHelp(true)}
            bannerImageUrl={TITLE_BANNER_URL}
          />
        )}

        {currentView === 'STAGE_SELECT' && (
          <StageSelectScreen
            onSelectStage={handleSelectStage}
            clearedStages={clearedStages}
            unlockedScrolls={unlockedScrolls}
            cakePieces={cakePieces}
          />
        )}

        {currentView === 'PLAYING' && (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Stage Title Ribbon */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span className="font-bold text-slate-200">
                {stageData.config.title} · {stageData.config.subtitle}
              </span>
              <span>
                操作：WASD 移動/飄浮 | J 吸入/攻擊 | S 吞入肚子 | E 自動融合 | C 收存能力
              </span>
            </div>

            {/* DS Dual Screen Console Mockup */}
            <div className="w-full bg-slate-800 rounded-3xl p-2.5 sm:p-4 shadow-2xl border-4 border-slate-700/80">
              {/* TOP SCREEN: Action Canvas */}
              <ActionCanvas
                stageData={stageData}
                playerState={playerState}
                setPlayerState={setPlayerState}
                onStageClear={handleStageClear}
                onGameOver={handleGameOver}
                onAddBubble={handleAddBubble}
                isHeistActive={isHeistActive}
                setIsHeistActive={setIsHeistActive}
                bgImageUrl={stageData.config.theme === 'meadow' ? STAGE_BG_URL : undefined}
              />

              {/* DS Hinge / Bezel separator */}
              <div className="h-4 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center gap-2 border-y border-slate-700/60 my-0.5">
                <div className="w-12 h-1 bg-slate-600 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-slate-600" />
                <div className="w-12 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* BOTTOM SCREEN: Interactive Belly Bubbles */}
              <BellyScreen
                bubbles={playerState.stomach}
                currentAbility={playerState.currentAbility}
                playerHp={playerState.hp}
                maxHp={playerState.maxHp}
                onEquipAbility={handleEquipAbility}
                onEatFood={handleEatFood}
                onUseSuperStar={handleUseSuperStar}
                onFuseBubbles={handleFuseBubbles}
                onSpitBubble={handleSpitBubble}
                onStoreCurrentAbility={handleStoreCurrentAbility}
                isHeistActive={isHeistActive}
              />
            </div>

            {/* Virtual Gamepad for mobile devices */}
            <VirtualGamepad
              onKeyDown={handleVirtualKeyDown}
              onKeyUp={handleVirtualKeyUp}
              onStoreAbility={handleStoreCurrentAbility}
              onQuickFuse={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
              }}
            />

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border-2 border-rose-600/70 p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                  <div className="text-4xl mb-2">💫</div>
                  <h3 className="text-2xl font-black text-rose-400 mb-1">波波力竭倒下了！</h3>
                  <p className="text-xs text-slate-300 mb-6">
                    被怪盜團或關卡陷阱擊倒了。別氣餒，喝口茶重新出發！
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSelectStage(currentStageId)}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" /> 重新挑戰本關
                    </button>
                    <button
                      onClick={() => setCurrentView('STAGE_SELECT')}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                    >
                      返回選關
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showChestModal && (
        <ChestOpeningModal
          stageConfig={stageData.config}
          hasGoldenChest={chestModalData.hasGolden}
          hasSilverChest={chestModalData.hasSilver}
          onProceed={handleProceedAfterChest}
          cakeImageUrl={CAKE_TREASURE_URL}
        />
      )}

      {showTreasury && (
        <CollectionModal
          unlockedScrolls={unlockedScrolls}
          cakePieces={cakePieces}
          maxCakePieces={3}
          onClose={() => setShowTreasury(false)}
          cakeImageUrl={CAKE_TREASURE_URL}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
