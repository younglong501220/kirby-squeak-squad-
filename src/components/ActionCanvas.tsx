import React, { useRef, useEffect, useCallback } from 'react';
import { Entity, Particle, PlayerState, AbilityType, ItemType, StomachBubble } from '../types/game';
import { StageData } from '../utils/stageBuilder';
import { sound } from '../utils/audio';
import { ABILITIES } from '../utils/constants';
import {
  drawWaddleDee,
  drawSirKibble,
  drawHotHead,
  drawPoppyBros,
  drawChilly,
  drawSparky,
  drawSqueaker,
  drawRogueSpike,
  drawBaronSqueak,
} from '../utils/enemyRenderer';

interface ActionCanvasProps {
  stageData: StageData;
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  onStageClear: (hasGoldenChest: boolean, hasSilverChest: boolean) => void;
  onGameOver: () => void;
  onAddBubble: (itemType: ItemType) => boolean;
  isHeistActive: boolean;
  setIsHeistActive: (active: boolean) => void;
  bgImageUrl?: string;
}

export const ActionCanvas: React.FC<ActionCanvasProps> = ({
  stageData,
  playerState,
  setPlayerState,
  onStageClear,
  onGameOver,
  onAddBubble,
  isHeistActive,
  setIsHeistActive,
  bgImageUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable game simulation state
  const simRef = useRef<{
    player: PlayerState;
    entities: Entity[];
    solids: { x: number; y: number; w: number; h: number; type?: string; color?: string }[];
    waters: { x: number; y: number; w: number; h: number; isFrozen?: boolean }[];
    particles: Particle[];
    cameraX: number;
    keys: Record<string, boolean>;
    heistTriggered: boolean;
    stageGoalDoor: { x: number; y: number; w: number; h: number };
    bgImage: HTMLImageElement | null;
    hasGoldenChestWon: boolean;
    hasSilverChestWon: boolean;
    frameCount: number;
  }>({
    player: { ...playerState },
    entities: [...stageData.entities],
    solids: [...stageData.solids],
    waters: stageData.waters.map((w) => ({ ...w })),
    particles: [],
    cameraX: 0,
    keys: {},
    heistTriggered: false,
    stageGoalDoor: { ...stageData.goalDoor },
    bgImage: null,
    hasGoldenChestWon: false,
    hasSilverChestWon: false,
    frameCount: 0,
  });

  // Keep player sync from props when ability or stomach changes externally
  useEffect(() => {
    simRef.current.player.currentAbility = playerState.currentAbility;
    simRef.current.player.stomach = playerState.stomach;
    simRef.current.player.hp = playerState.hp;
    simRef.current.player.maxHp = playerState.maxHp;
  }, [playerState.currentAbility, playerState.stomach, playerState.hp, playerState.maxHp]);

  // Load BG Image if provided
  useEffect(() => {
    if (bgImageUrl) {
      const img = new Image();
      img.src = bgImageUrl;
      img.onload = () => {
        simRef.current.bgImage = img;
      };
    }
  }, [bgImageUrl]);

  // Reset stage data when stageData prop changes
  useEffect(() => {
    const p = simRef.current.player;
    p.x = stageData.spawnPoint.x;
    p.y = stageData.spawnPoint.y;
    p.vx = 0;
    p.vy = 0;
    p.carryingChest = false;
    p.mouthItem = null;
    p.isAlive = true;

    simRef.current.entities = JSON.parse(JSON.stringify(stageData.entities));
    simRef.current.solids = JSON.parse(JSON.stringify(stageData.solids));
    simRef.current.waters = JSON.parse(JSON.stringify(stageData.waters));
    simRef.current.stageGoalDoor = { ...stageData.goalDoor };
    simRef.current.heistTriggered = false;
    simRef.current.hasGoldenChestWon = false;
    simRef.current.hasSilverChestWon = false;
    setIsHeistActive(false);
  }, [stageData, setIsHeistActive]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      simRef.current.keys[k] = true;

      // Single trigger actions
      if (k === 'w' || k === 'arrowup' || k === ' ') {
        const p = simRef.current.player;
        if (p.isGrounded) {
          p.vy = -10.5;
          p.isGrounded = false;
          sound.playJump();
          addJumpDust(p.x + p.w / 2, p.y + p.h);
        } else {
          // Floating flight (Kirby flutter)
          p.isFloating = true;
          p.vy = -5.8;
          sound.playFloatFlap();
          addAirPuff(p.x + p.w / 2, p.y + p.h / 2, 0, 2);
        }
      }

      // S or Down: Swallow if mouth full, or crouch/slide
      if (k === 's' || k === 'arrowdown') {
        const p = simRef.current.player;
        if (p.mouthItem) {
          // Try to swallow into belly
          sound.playSwallow();
          const item = p.mouthItem;
          p.mouthItem = null;
          const added = onAddBubble(item);
          if (!added) {
            // Belly was full: equip directly if ability, or restore if food
            if (item.startsWith('Food') || item === 'MaximTomato') {
              p.hp = Math.min(p.maxHp, p.hp + 40);
            } else if (item in ABILITIES) {
              p.currentAbility = item as AbilityType;
            }
          }
        } else if (p.isGrounded && Math.abs(p.vx) > 2) {
          // Slide kick
          p.isSliding = true;
          p.slideTimer = 18;
          p.vx = p.facing * 9;
          sound.playSwordSlash();
          addJumpDust(p.x + p.w / 2, p.y + p.h);
        }
      }

      // Attack / Inhale / Spit / Ability move
      if (k === 'j') {
        const p = simRef.current.player;
        if (p.isFloating) {
          // Spit out air bullet and drop
          p.isFloating = false;
          p.mouthItem = null;
          sound.playSpit();
          spawnAirBullet(p.x + (p.facing === 1 ? p.w : -10), p.y + p.h / 2, p.facing);
        } else if (p.mouthItem) {
          // Spit out Star Bullet
          sound.playSpit();
          spawnStarBullet(p.x + (p.facing === 1 ? p.w : -16), p.y + p.h / 2 - 10, p.facing, p.mouthItem);
          p.mouthItem = null;
        } else if (p.currentAbility !== 'Normal') {
          // Perform copy ability action
          performAbilityAttack(p);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      simRef.current.keys[k] = false;
      if (k === 'j') {
        const p = simRef.current.player;
        p.isInhaling = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onAddBubble]);

  // Particle helpers
  const addJumpDust = (x: number, y: number) => {
    for (let i = 0; i < 6; i++) {
      simRef.current.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 2,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        size: 4 + Math.random() * 4,
        color: '#E2E8F0',
        alpha: 0.8,
        life: 0,
        maxLife: 15,
        shape: 'smoke',
      });
    }
  };

  const addAirPuff = (x: number, y: number, vx = 0, vy = 0) => {
    for (let i = 0; i < 4; i++) {
      simRef.current.particles.push({
        x,
        y,
        vx: vx + (Math.random() - 0.5) * 2,
        vy: vy + Math.random() * 1.5,
        size: 5 + Math.random() * 5,
        color: '#FFFFFF',
        alpha: 0.7,
        life: 0,
        maxLife: 12,
        shape: 'circle',
      });
    }
  };

  const spawnAirBullet = (x: number, y: number, facing: 1 | -1) => {
    simRef.current.entities.push({
      id: `air-bullet-${Date.now()}`,
      type: 'projectile',
      name: '空氣彈',
      x,
      y: y - 10,
      w: 22,
      h: 22,
      vx: facing * 8,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing,
      color: '#FFFFFF',
      aiTimer: 25,
    });
  };

  const spawnStarBullet = (x: number, y: number, facing: 1 | -1, item: ItemType) => {
    const isChest = item === 'GoldenChest' || item === 'SilverChest';
    simRef.current.entities.push({
      id: `star-bullet-${Date.now()}`,
      type: isChest ? 'chest' : 'star',
      itemType: item,
      name: isChest ? '拋出寶箱' : '星彈',
      x,
      y,
      w: isChest ? 34 : 26,
      h: isChest ? 34 : 26,
      vx: facing * 9.5,
      vy: -1.5,
      hp: 1,
      maxHp: 1,
      facing,
      color: isChest ? '#F59E0B' : '#FACC15',
      aiTimer: isChest ? 600 : 45,
    });
  };

  // Perform copy ability attacks
  const performAbilityAttack = (p: PlayerState) => {
    p.attackTimer = 16;
    p.attackType = p.currentAbility;

    const ab = p.currentAbility;
    const facing = p.facing;
    const px = p.x + (facing === 1 ? p.w : -32);
    const py = p.y;

    if (ab === 'Sword' || ab === 'FireSword' || ab === 'IceSword' || ab === 'ThunderSword') {
      sound.playSwordSlash();
      // Melee slash projectile hit box
      simRef.current.entities.push({
        id: `slash-${Date.now()}`,
        type: 'projectile',
        ability: ab,
        name: `${ab}斬擊`,
        x: px,
        y: py - 6,
        w: 48,
        h: 48,
        vx: facing * 2,
        vy: 0,
        hp: 1,
        maxHp: 1,
        facing,
        color:
          ab === 'FireSword'
            ? '#F97316'
            : ab === 'IceSword'
            ? '#06B6D4'
            : ab === 'ThunderSword'
            ? '#FACC15'
            : '#22C55E',
        aiTimer: 10,
      });

      // Full HP Sword Beam!
      if (p.hp >= p.maxHp) {
        simRef.current.entities.push({
          id: `beam-${Date.now()}`,
          type: 'projectile',
          ability: ab,
          name: '劍氣波',
          x: px + facing * 20,
          y: py + 6,
          w: 26,
          h: 26,
          vx: facing * 9,
          vy: 0,
          hp: 1,
          maxHp: 1,
          facing,
          color: ab === 'FireSword' ? '#F97316' : ab === 'IceSword' ? '#38BDF8' : '#86EFAC',
          aiTimer: 35,
        });
      }
    } else if (ab === 'Fire' || ab === 'FireBomb') {
      sound.playFireBurst();
      for (let i = 0; i < 3; i++) {
        simRef.current.entities.push({
          id: `fire-${Date.now()}-${i}`,
          type: 'projectile',
          ability: 'Fire',
          name: '烈焰噴射',
          x: px + (Math.random() - 0.5) * 10,
          y: py + 4 + (Math.random() - 0.5) * 16,
          w: 24,
          h: 24,
          vx: facing * (6 + i * 2),
          vy: (Math.random() - 0.5) * 2,
          hp: 1,
          maxHp: 1,
          facing,
          color: '#EF4444',
          aiTimer: 18,
        });
      }
    } else if (ab === 'Ice' || ab === 'IceBomb') {
      sound.playIceFreeze();
      for (let i = 0; i < 3; i++) {
        simRef.current.entities.push({
          id: `ice-${Date.now()}-${i}`,
          type: 'projectile',
          ability: 'Ice',
          name: '冰霜風暴',
          x: px,
          y: py + 4 + (Math.random() - 0.5) * 16,
          w: 24,
          h: 24,
          vx: facing * (5.5 + i * 2),
          vy: (Math.random() - 0.5) * 2,
          hp: 1,
          maxHp: 1,
          facing,
          color: '#38BDF8',
          aiTimer: 20,
        });
      }
    } else if (ab === 'Spark') {
      sound.playSparkZap();
      simRef.current.entities.push({
        id: `spark-dome-${Date.now()}`,
        type: 'projectile',
        ability: 'Spark',
        name: '電磁力場',
        x: p.x - 20,
        y: p.y - 20,
        w: p.w + 40,
        h: p.h + 40,
        vx: 0,
        vy: 0,
        hp: 1,
        maxHp: 1,
        facing,
        color: '#EAB308',
        aiTimer: 14,
      });
    } else if (ab === 'Bomb') {
      sound.playJump();
      simRef.current.entities.push({
        id: `bomb-${Date.now()}`,
        type: 'projectile',
        ability: 'Bomb',
        name: '定時炸彈',
        x: px,
        y: py - 10,
        w: 24,
        h: 24,
        vx: facing * 7,
        vy: -5,
        hp: 1,
        maxHp: 1,
        facing,
        color: '#6366F1',
        aiTimer: 50,
      });
    }
  };

  // Trigger Squeak Squad Rogues Heist
  const triggerHeist = useCallback(() => {
    if (simRef.current.heistTriggered) return;
    simRef.current.heistTriggered = true;
    setIsHeistActive(true);
    sound.playHeistAlarm();
    sound.playBGM('heist');

    const p = simRef.current.player;
    // Spawn Spike the nimble thief and two Squeaker minions
    const spike: Entity = {
      id: `rogue-spike-${Date.now()}`,
      type: 'rogue',
      subType: 'Spike',
      name: '怪盜刺客·斯派克 (Spike)',
      x: Math.min(stageData.config.width - 200, p.x + 350),
      y: 350,
      w: 36,
      h: 40,
      vx: -3,
      vy: 0,
      hp: 75,
      maxHp: 75,
      facing: -1,
      color: '#DC2626',
      state: 'chase',
      aiTimer: 0,
    };

    const minion: Entity = {
      id: `rogue-minion-${Date.now()}`,
      type: 'rogue',
      subType: 'Squeaker',
      name: '怪盜小兵',
      x: Math.min(stageData.config.width - 200, p.x + 250),
      y: 360,
      w: 26,
      h: 28,
      vx: -2.5,
      vy: 0,
      hp: 30,
      maxHp: 30,
      facing: -1,
      color: '#F87171',
      state: 'chase',
      aiTimer: 0,
    };

    simRef.current.entities.push(spike, minion);
  }, [stageData.config.width, setIsHeistActive]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playBGM(stageData.config.musicTrack);

    const update = () => {
      const { player, entities, solids, waters, particles, keys, stageGoalDoor } = simRef.current;

      if (!player.isAlive) {
        return;
      }

      // --- 1. Player Movement & Physics ---
      const moveSpeed = player.carryingChest ? 3.2 : player.isSliding ? 8.5 : 4.6;
      if (player.isSliding) {
        player.slideTimer--;
        if (player.slideTimer <= 0) {
          player.isSliding = false;
        }
      } else {
        if (keys['a'] || keys['arrowleft']) {
          player.vx = -moveSpeed;
          player.facing = -1;
        } else if (keys['d'] || keys['arrowright']) {
          player.vx = moveSpeed;
          player.facing = 1;
        } else {
          player.vx *= 0.72;
          if (Math.abs(player.vx) < 0.2) player.vx = 0;
        }
      }

      // Gravity & Floating
      if (player.isFloating) {
        player.vy += 0.15;
        if (player.vy > 1.8) player.vy = 1.8;
      } else {
        player.vy += 0.48;
        if (player.vy > 12) player.vy = 12;
      }

      // Inhale mechanism: long press J with empty mouth and normal/sword
      player.isInhaling = Boolean(keys['j'] && !player.mouthItem && !player.isFloating && player.currentAbility === 'Normal');
      if (player.isInhaling) {
        player.inhaleTimer++;
        if (player.inhaleTimer % 10 === 0) {
          sound.playInhale();
        }
      } else {
        player.inhaleTimer = 0;
      }

      // Apply velocity
      player.x += player.vx;
      player.y += player.vy;

      // Invincible / Attack timers
      if (player.invincibleTimer > 0) player.invincibleTimer--;
      if (player.attackTimer > 0) player.attackTimer--;

      // Boundary bounds
      if (player.x < 0) player.x = 0;
      if (player.x > stageData.config.width - player.w) player.x = stageData.config.width - player.w;

      // Solid collision resolution for Player
      player.isGrounded = false;
      for (const s of solids) {
        if (
          player.x < s.x + s.w &&
          player.x + player.w > s.x &&
          player.y < s.y + s.h &&
          player.y + player.h > s.y
        ) {
          // Landing on top
          if (player.vy >= 0 && player.y + player.h - player.vy <= s.y + 12) {
            player.y = s.y - player.h;
            player.vy = 0;
            player.isGrounded = true;
            if (player.isFloating) {
              player.isFloating = false;
            }
          }
          // Hitting ceiling
          else if (player.vy < 0 && player.y - player.vy >= s.y + s.h - 10) {
            player.y = s.y + s.h;
            player.vy = 0;
          }
          // Lateral walls
          else if (player.vx > 0) {
            player.x = s.x - player.w;
            player.vx = 0;
          } else if (player.vx < 0) {
            player.x = s.x + s.w;
            player.vx = 0;
          }
        }
      }

      // Water collision: check if frozen or liquid
      for (const w of waters) {
        if (
          player.x < w.x + w.w &&
          player.x + player.w > w.x &&
          player.y < w.y + w.h &&
          player.y + player.h > w.y
        ) {
          if (w.isFrozen) {
            // Walkable solid ice platform
            if (player.vy >= 0 && player.y + player.h - player.vy <= w.y + 12) {
              player.y = w.y - player.h;
              player.vy = 0;
              player.isGrounded = true;
            }
          } else {
            // Liquid swimming buoyancy
            player.vy *= 0.7;
            if (player.vy > 1.5) player.vy = 1.5;
            player.isGrounded = true;
          }
        }
      }

      // Pit fall death
      if (player.y > stageData.config.height + 60) {
        player.hp = 0;
        player.isAlive = false;
        sound.playHit();
        onGameOver();
        return;
      }

      // Check Goal Door Stage Clear
      if (
        player.x < stageGoalDoor.x + stageGoalDoor.w &&
        player.x + player.w > stageGoalDoor.x &&
        player.y < stageGoalDoor.y + stageGoalDoor.h &&
        player.y + player.h > stageGoalDoor.y
      ) {
        sound.playVictoryFanfare();
        const hasGolden =
          player.carryingChest ||
          simRef.current.hasGoldenChestWon ||
          player.stomach.some((b) => b.itemType === 'GoldenChest');
        const hasSilver =
          simRef.current.hasSilverChestWon ||
          player.stomach.some((b) => b.itemType === 'SilverChest');

        onStageClear(hasGolden, hasSilver);
        return;
      }

      // --- 2. Inhale Logic & Suction Vortex ---
      const inhaleRange = 150;
      const inhaleBox = {
        x: player.facing === 1 ? player.x + player.w : player.x - inhaleRange,
        y: player.y - 30,
        w: inhaleRange,
        h: player.h + 60,
      };

      // Add particle wind swirls when inhaling
      if (player.isInhaling) {
        for (let i = 0; i < 2; i++) {
          const spawnDist = 40 + Math.random() * (inhaleRange - 40);
          particles.push({
            x: player.facing === 1 ? player.x + player.w + spawnDist : player.x - spawnDist,
            y: player.y + player.h / 2 + (Math.random() - 0.5) * 50,
            vx: player.facing === 1 ? -7 - Math.random() * 4 : 7 + Math.random() * 4,
            vy: (Math.random() - 0.5) * 2,
            size: 3 + Math.random() * 3,
            color: '#FFFFFF',
            alpha: 0.6,
            life: 0,
            maxLife: 15,
            shape: 'star',
          });
        }
      }

      // --- 3. Entities & Rogues Simulation ---
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];

        // Projectile expiration or movement
        if (ent.type === 'projectile' || ent.type === 'star') {
          ent.x += ent.vx;
          ent.y += ent.vy;
          if (ent.aiTimer !== undefined) {
            ent.aiTimer--;
            if (ent.aiTimer <= 0) {
              if (ent.ability === 'Bomb' || ent.name === '定時炸彈') {
                sound.playBombBoom();
                addAirPuff(ent.x + ent.w / 2, ent.y + ent.h / 2);
              }
              entities.splice(i, 1);
              continue;
            }
          }

          // Environmental interactions with projectiles:
          // Fire melts bramble / lights dynamite
          // Ice freezes water
          // Spark triggers switches
          for (let j = entities.length - 1; j >= 0; j--) {
            const other = entities[j];
            if (other === ent) continue;

            if (other.type === 'interactive_block') {
              if (
                ent.x < other.x + other.w &&
                ent.x + ent.w > other.x &&
                ent.y < other.y + other.h &&
                ent.y + ent.h > other.y
              ) {
                // Bramble burning
                if (
                  other.blockType === 'bramble' &&
                  (ent.ability === 'Fire' || ent.ability === 'FireSword' || ent.ability === 'FireBomb' || ent.ability === 'Bomb')
                ) {
                  sound.playFireBurst();
                  entities.splice(j, 1);
                  addAirPuff(other.x, other.y);
                }
                // Dynamite exploding
                else if (
                  other.blockType === 'dynamite' &&
                  (ent.ability === 'Fire' || ent.ability === 'FireSword' || ent.ability === 'Bomb')
                ) {
                  sound.playBombBoom();
                  entities.splice(j, 1);
                  addAirPuff(other.x, other.y);
                }
                // Electric switch activation
                else if (
                  other.blockType === 'switch' &&
                  (ent.ability === 'Spark' || ent.ability === 'ThunderSword')
                ) {
                  sound.playSparkZap();
                  other.isActivated = true;
                  other.color = '#10B981';
                  other.name = '電極已接通！';
                }
              }
            }
          }

          // Ice projectiles freeze water into ice blocks!
          if (ent.ability === 'Ice' || ent.ability === 'IceSword' || ent.ability === 'IceBomb') {
            for (const w of waters) {
              if (ent.x > w.x - 20 && ent.x < w.x + w.w + 20 && ent.y > w.y - 30) {
                w.isFrozen = true;
                sound.playIceFreeze();
              }
            }
          }
        }

        // Chest gravity & pickup
        if (ent.type === 'chest') {
          ent.vy += 0.4;
          ent.y += ent.vy;

          // Solid floor collision for loose chest
          for (const s of solids) {
            if (
              ent.x < s.x + s.w &&
              ent.x + ent.w > s.x &&
              ent.y + ent.h >= s.y &&
              ent.y < s.y + s.h
            ) {
              ent.y = s.y - ent.h;
              ent.vy = 0;
            }
          }

          // Player touches loose chest -> Pick up!
          if (
            !player.carryingChest &&
            player.x < ent.x + ent.w &&
            player.x + player.w > ent.x &&
            player.y < ent.y + ent.h &&
            player.y + player.h > ent.y
          ) {
            sound.playSwallow();
            if (ent.itemType === 'GoldenChest') {
              player.carryingChest = true;
              triggerHeist();
              entities.splice(i, 1);
              continue;
            } else {
              simRef.current.hasSilverChestWon = true;
              entities.splice(i, 1);
              continue;
            }
          }
        }

        // Inhale attraction physics on enemies, items, loose chests
        if (player.isInhaling && (ent.type === 'enemy' || ent.type === 'item' || ent.type === 'chest')) {
          if (
            ent.x < inhaleBox.x + inhaleBox.w &&
            ent.x + ent.w > inhaleBox.x &&
            ent.y < inhaleBox.y + inhaleBox.h &&
            ent.y + ent.h > inhaleBox.y
          ) {
            // Drag toward Kirby's mouth
            ent.x += (player.x + player.w / 2 - ent.x) * 0.16;
            ent.y += (player.y + player.h / 2 - ent.y) * 0.16;
            ent.isBeingInhaled = true;

            // Close enough to swallow into mouth!
            if (Math.abs(player.x - ent.x) < 22 && Math.abs(player.y - ent.y) < 26) {
              sound.playSwallow();
              player.mouthItem = ent.itemType || ent.ability || 'FoodCherry';
              player.isInhaling = false;
              if (ent.type === 'chest' && ent.itemType === 'GoldenChest') {
                triggerHeist();
              }
              entities.splice(i, 1);
              continue;
            }
          } else {
            ent.isBeingInhaled = false;
          }
        }

        // Enemy & Rogue AI
        if (ent.type === 'enemy' || ent.type === 'rogue' || ent.type === 'boss') {
          // Patrol movement
          if (ent.state === 'patrol') {
            ent.x += ent.vx;
            ent.aiTimer = (ent.aiTimer || 0) + 1;
            if (ent.aiTimer > 80) {
              ent.vx *= -1;
              ent.facing = ent.vx > 0 ? 1 : -1;
              ent.aiTimer = 0;
            }
          }

          // Rogue AI: Target chest!
          if (ent.type === 'rogue') {
            // Find if loose chest exists
            const looseChest = entities.find((e) => e.type === 'chest' && e.itemType === 'GoldenChest');

            if (ent.state === 'holding_chest') {
              // Flee toward exit burrow!
              ent.vx = 4;
              ent.facing = 1;
              ent.x += ent.vx;

              // Check if reached burrow (fled with chest)
              if (ent.x > stageData.config.width - 250) {
                // Thief escaped with chest!
                sound.playThiefLaugh();
                entities.splice(i, 1);
                continue;
              }
            } else if (looseChest) {
              // Chase loose chest
              const dir = looseChest.x > ent.x ? 1 : -1;
              ent.vx = dir * 3.5;
              ent.facing = dir;
              ent.x += ent.vx;

              // Grab chest!
              if (Math.abs(ent.x - looseChest.x) < 20 && Math.abs(ent.y - looseChest.y) < 20) {
                sound.playThiefLaugh();
                ent.state = 'holding_chest';
                // Remove loose chest
                const cIdx = entities.indexOf(looseChest);
                if (cIdx !== -1) entities.splice(cIdx, 1);
              }
            } else {
              // Chase player to knock chest free
              const dir = player.x > ent.x ? 1 : -1;
              ent.vx = dir * 2.8;
              ent.facing = dir;
              ent.x += ent.vx;
            }
          }

          // Boss AI: Baron Squeak
          if (ent.type === 'boss') {
            ent.aiTimer = (ent.aiTimer || 0) + 1;
            if (ent.aiTimer % 90 === 0) {
              // Boss casts elemental spells
              sound.playFireBurst();
              for (let k = -1; k <= 1; k++) {
                entities.push({
                  id: `boss-spell-${Date.now()}-${k}`,
                  type: 'projectile',
                  name: '三元魔導彈',
                  x: ent.x,
                  y: ent.y + 20,
                  w: 24,
                  h: 24,
                  vx: ent.facing * 5,
                  vy: k * 2,
                  hp: 1,
                  maxHp: 1,
                  facing: ent.facing,
                  color: '#A855F7',
                  aiTimer: 40,
                });
              }
            }
            if (ent.aiTimer % 180 === 0) {
              // Teleport dash
              ent.x = player.x + (Math.random() > 0.5 ? 140 : -140);
              sound.playSparkZap();
            }
          }

          // Damage collision between Player and Enemies/Rogues
          if (player.invincibleTimer <= 0) {
            // Kirby sliding kick attacks enemies
            if (player.isSliding) {
              if (
                player.x < ent.x + ent.w &&
                player.x + player.w > ent.x &&
                player.y < ent.y + ent.h &&
                player.y + player.h > ent.y
              ) {
                sound.playHit();
                ent.hp -= 25;
                ent.vx = player.facing * 5;
                if (ent.state === 'holding_chest') {
                  // Drop the chest!
                  ent.state = 'chase';
                  entities.push({
                    id: `chest-dropped-${Date.now()}`,
                    type: 'chest',
                    itemType: 'GoldenChest',
                    name: '脫落的黃金寶箱',
                    x: ent.x,
                    y: ent.y - 20,
                    w: 36,
                    h: 36,
                    vx: -player.facing * 4,
                    vy: -5,
                    hp: 100,
                    maxHp: 100,
                    facing: 1,
                    color: '#F59E0B',
                  });
                }
              }
            } else if (
              player.x < ent.x + ent.w &&
              player.x + player.w > ent.x &&
              player.y < ent.y + ent.h &&
              player.y + player.h > ent.y
            ) {
              // Player takes damage!
              player.hp -= 15;
              player.invincibleTimer = 45;
              player.vy = -5;
              player.vx = -player.facing * 4;
              sound.playHit();

              // Drop carrying chest if hit hard!
              if (player.carryingChest) {
                player.carryingChest = false;
                entities.push({
                  id: `chest-dropped-player-${Date.now()}`,
                  type: 'chest',
                  itemType: 'GoldenChest',
                  name: '掉落的大寶箱',
                  x: player.x,
                  y: player.y - 20,
                  w: 36,
                  h: 36,
                  vx: -player.facing * 3,
                  vy: -5,
                  hp: 100,
                  maxHp: 100,
                  facing: 1,
                  color: '#F59E0B',
                });
              }

              if (player.hp <= 0) {
                player.isAlive = false;
                onGameOver();
                return;
              }
            }
          }

          // Check if enemy died
          if (ent.hp <= 0) {
            sound.playSpit();
            addAirPuff(ent.x, ent.y);
            // If enemy holds an ability, drop an ability star
            if (ent.ability) {
              entities.push({
                id: `star-drop-${Date.now()}`,
                type: 'item',
                itemType: ent.ability,
                ability: ent.ability,
                name: `${ent.ability}之星`,
                x: ent.x,
                y: ent.y,
                w: 26,
                h: 26,
                vx: 0,
                vy: -3,
                hp: 1,
                maxHp: 1,
                facing: 1,
                color: ABILITIES[ent.ability]?.color || '#FACC15',
              });
            }
            entities.splice(i, 1);
            continue;
          }
        }
      }

      // --- 4. Camera Follows Player smoothly ---
      simRef.current.frameCount++;
      const viewW = canvas.width;
      const targetCamX = player.x - viewW / 2 + player.w / 2;
      simRef.current.cameraX += (targetCamX - simRef.current.cameraX) * 0.12;
      if (simRef.current.cameraX < 0) simRef.current.cameraX = 0;
      if (simRef.current.cameraX > stageData.config.width - viewW) {
        simRef.current.cameraX = stageData.config.width - viewW;
      }

      // --- 5. Render Canvas Viewport ---
      renderScene(ctx, canvas);

      // Sync state back to React every few frames
      setPlayerState((prev) => ({
        ...prev,
        hp: player.hp,
        carryingChest: player.carryingChest,
        mouthItem: player.mouthItem,
        currentAbility: player.currentAbility,
      }));

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animId);
      sound.stopBGM();
    };
  }, [stageData, triggerHeist, onStageClear, onGameOver, setPlayerState]);

  // Canvas Rendering Procedure
  const renderScene = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { player, entities, solids, waters, particles, cameraX, stageGoalDoor, bgImage } =
      simRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Parallax Sky Background
    if (bgImage && bgImage.complete) {
      const bgParallax = -(cameraX * 0.25) % canvas.width;
      ctx.drawImage(bgImage, bgParallax, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImage, bgParallax + canvas.width, 0, canvas.width, canvas.height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, stageData.config.bgGradient[0]);
      grad.addColorStop(1, stageData.config.bgGradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    // 2. Render Waters (Ice or Liquid)
    for (const w of waters) {
      if (w.isFrozen) {
        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.fillStyle = '#E0F2FE';
        ctx.fillRect(w.x, w.y, w.w, 8);
        ctx.strokeStyle = '#38BDF8';
        ctx.strokeRect(w.x, w.y, w.w, w.h);
      } else {
        ctx.fillStyle = '#0284C7CC';
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(w.x, w.y, w.w, 6);
      }
    }

    // 3. Render Solids (Ground & Platforms)
    for (const s of solids) {
      // Top grassy layer
      ctx.fillStyle = s.color || (stageData.config.theme === 'meadow' ? '#16A34A' : stageData.config.theme === 'cavern' ? '#3B82F6' : '#7C3AED');
      ctx.fillRect(s.x, s.y, s.w, 10);

      // Deep earth layer
      ctx.fillStyle = stageData.config.theme === 'meadow' ? '#78350F' : stageData.config.theme === 'cavern' ? '#1E1B4B' : '#4C1D95';
      ctx.fillRect(s.x, s.y + 10, s.w, s.h - 10);

      // Subtle border
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.strokeRect(s.x, s.y, s.w, s.h);
    }

    // 4. Render Goal Door
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(stageGoalDoor.x, stageGoalDoor.y, stageGoalDoor.w, stageGoalDoor.h);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(stageGoalDoor.x + 4, stageGoalDoor.y + 8, stageGoalDoor.w - 8, stageGoalDoor.h - 8);
    // Star symbol on door
    ctx.fillStyle = '#FDE047';
    ctx.font = '24px sans-serif';
    ctx.fillText('⭐', stageGoalDoor.x + 10, stageGoalDoor.y + 44);

    // 5. Render Entities
    for (const ent of entities) {
      if (ent.type === 'interactive_block') {
        ctx.fillStyle = ent.color;
        ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
        ctx.strokeStyle = '#FFFFFF55';
        ctx.strokeRect(ent.x, ent.y, ent.w, ent.h);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.fillText(ent.blockType === 'bramble' ? '🌿藤蔓' : ent.blockType === 'switch' ? '⚡開關' : '💣炸藥', ent.x + 2, ent.y + ent.h / 2 + 3);
        continue;
      }

      if (ent.type === 'chest') {
        // Render Treasure Chest
        ctx.fillStyle = ent.color;
        ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
        ctx.fillStyle = '#78350F';
        ctx.fillRect(ent.x + 2, ent.y + ent.h / 2 - 2, ent.w - 4, 4);
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, ent.y + ent.h / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      if (ent.type === 'hazard') {
        // Escape burrow / portal
        ctx.fillStyle = ent.color;
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, ent.y + ent.h / 2, ent.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#F43F5E';
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.fillText('🕳️秘密基地', ent.x - 4, ent.y - 6);
        continue;
      }

      if (ent.type === 'rogue') {
        // Render Nutty Rogue members with detailed models
        if (ent.subType === 'Spike') {
          drawRogueSpike(ctx, ent, simRef.current.frameCount);
        } else {
          drawSqueaker(ctx, ent, simRef.current.frameCount);
        }

        // If holding stolen chest
        if (ent.state === 'holding_chest') {
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(ent.x + 2, ent.y - 48, 32, 22);
          ctx.fillStyle = '#78350F';
          ctx.fillRect(ent.x + 4, ent.y - 38, 28, 3);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('👑搶得！', ent.x - 2, ent.y - 52);
        }
        continue;
      }

      if (ent.type === 'boss') {
        // Render Baron Squeak Boss with grand top hat, magic wand and purple royal cape
        drawBaronSqueak(ctx, ent, simRef.current.frameCount);
        continue;
      }

      // Enemy Characters: Distinct designs, NO rectangles!
      if (ent.type === 'enemy') {
        if (ent.subType === 'WaddleDee') {
          drawWaddleDee(ctx, ent, simRef.current.frameCount);
        } else if (ent.subType === 'SirKibble') {
          drawSirKibble(ctx, ent, simRef.current.frameCount);
        } else if (ent.subType === 'HotHead') {
          drawHotHead(ctx, ent, simRef.current.frameCount);
        } else if (ent.subType === 'PoppyBros') {
          drawPoppyBros(ctx, ent, simRef.current.frameCount);
        } else if (ent.subType === 'Chilly') {
          drawChilly(ctx, ent, simRef.current.frameCount);
        } else if (ent.subType === 'Sparky') {
          drawSparky(ctx, ent, simRef.current.frameCount);
        } else {
          // Fallback procedural enemy if unspecified: round creature with eyes and feet
          const cx = ent.x + ent.w / 2;
          const cy = ent.y + ent.h / 2;
          ctx.fillStyle = ent.color;
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF88';
          ctx.stroke();
          // Eyes
          ctx.fillStyle = '#000000';
          ctx.fillRect(cx - 3, cy - 4, 3, 6);
          ctx.fillRect(cx + 3, cy - 4, 3, 6);
        }

        // Mini HP indicator for tough foes
        if (ent.hp < ent.maxHp) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(ent.x, ent.y - 8, ent.w, 4);
          ctx.fillStyle = '#10B981';
          ctx.fillRect(ent.x, ent.y - 8, (ent.hp / ent.maxHp) * ent.w, 4);
        }
        continue;
      }

      // Collectible Items & Food (Cherries, Strawberry Cakes, Maxim Tomatoes, Ability Stars)
      if (ent.type === 'item') {
        const cx = ent.x + ent.w / 2;
        const cy = ent.y + ent.h / 2;
        const floatY = Math.sin(simRef.current.frameCount * 0.1 + ent.x) * 2;

        if (ent.itemType === 'FoodCherry') {
          // Double Cherries with green stem
          ctx.strokeStyle = '#15803D';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8 + floatY);
          ctx.quadraticCurveTo(cx - 4, cy - 2 + floatY, cx - 6, cy + 3 + floatY);
          ctx.moveTo(cx, cy - 8 + floatY);
          ctx.quadraticCurveTo(cx + 4, cy - 2 + floatY, cx + 6, cy + 3 + floatY);
          ctx.stroke();
          // Red round cherries
          ctx.fillStyle = '#E11D48';
          ctx.beginPath();
          ctx.arc(cx - 6, cy + 4 + floatY, 6, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy + 4 + floatY, 6, 0, Math.PI * 2);
          ctx.fill();
          // Highlight
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx - 8, cy + 2 + floatY, 1.8, 0, Math.PI * 2);
          ctx.arc(cx + 4, cy + 2 + floatY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (ent.itemType === 'FoodCake') {
          // Strawberry Slice Cake
          ctx.fillStyle = '#FFFBEB'; // cream cake base
          ctx.beginPath();
          ctx.moveTo(cx - 10, cy + 8 + floatY);
          ctx.lineTo(cx + 12, cy + 8 + floatY);
          ctx.lineTo(cx - 10, cy - 4 + floatY);
          ctx.closePath();
          ctx.fill();
          // Strawberry icing top
          ctx.fillStyle = '#FB7185';
          ctx.fillRect(cx - 10, cy - 4 + floatY, 22, 3);
          // Strawberry on top
          ctx.fillStyle = '#E11D48';
          ctx.beginPath();
          ctx.arc(cx - 4, cy - 7 + floatY, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (ent.itemType === 'MaximTomato') {
          // Maxim Tomato: big red tomato with "M" label
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(cx, cy + floatY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#991B1B';
          ctx.stroke();
          // Green tomato leaf stem
          ctx.fillStyle = '#16A34A';
          ctx.beginPath();
          ctx.arc(cx, cy - 11 + floatY, 4, 0, Math.PI * 2);
          ctx.fill();
          // Bold black 'M' in center
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('M', cx, cy + 4 + floatY);
          ctx.textAlign = 'start';
        } else {
          // Ability Star Dropped
          ctx.fillStyle = ent.color || '#FACC15';
          ctx.beginPath();
          ctx.arc(cx, cy + floatY, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ent.ability ? ent.ability[0] : '★', cx, cy + 4 + floatY);
          ctx.textAlign = 'start';
        }
        continue;
      }

      // Default projectiles & stars
      ctx.fillStyle = ent.color;
      if (ent.type === 'projectile' || ent.type === 'star') {
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, ent.y + ent.h / 2, ent.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, ent.y + ent.h / 2, ent.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.fillText(ent.ability || ent.name, ent.x - 4, ent.y - 4);
      }
    }

    // 6. Inhale Cone Visual Effect
    if (player.isInhaling) {
      const startX = player.facing === 1 ? player.x + player.w : player.x;
      const targetX = player.facing === 1 ? player.x + 150 : player.x - 150;
      const coneGrad = ctx.createLinearGradient(startX, player.y, targetX, player.y);
      coneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      coneGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(startX, player.y + player.h / 2);
      ctx.lineTo(targetX, player.y - 35);
      ctx.lineTo(targetX, player.y + player.h + 35);
      ctx.closePath();
      ctx.fill();
    }

    // 7. Render Player (Kirby / Popo)
    if (player.invincibleTimer % 4 < 2) {
      const radius = player.mouthItem ? 21 : player.isFloating ? 22 : 18;
      const centerX = player.x + player.w / 2;
      const centerY = player.y + player.h / 2;

      // Body (cute pink circle with highlight)
      ctx.fillStyle = player.mouthItem ? '#FB7185' : '#F472B6';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cheeks Blush
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(centerX - 8, centerY + 4, 3.5, 0, Math.PI * 2);
      ctx.arc(centerX + 8, centerY + 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Big expressive eyes
      ctx.fillStyle = '#0F172A';
      const eyeDir = player.facing === 1 ? 4 : -4;
      ctx.fillRect(centerX + eyeDir - 2, centerY - 6, 4, 9);
      ctx.fillRect(centerX + eyeDir + 6 * player.facing, centerY - 6, 4, 9);
      // Eye sparkles
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(centerX + eyeDir - 1, centerY - 5, 2, 4);
      ctx.fillRect(centerX + eyeDir + 6 * player.facing + 1, centerY - 5, 2, 4);

      // Feet
      ctx.fillStyle = '#E11D48';
      ctx.fillRect(centerX - 14, centerY + radius - 4, 10, 7);
      ctx.fillRect(centerX + 4, centerY + radius - 4, 10, 7);

      // Active Ability Hat Accessories!
      const ab = player.currentAbility;
      if (ab === 'Sword' || ab === 'FireSword' || ab === 'IceSword' || ab === 'ThunderSword') {
        // Hero Cap
        ctx.fillStyle =
          ab === 'FireSword'
            ? '#EA580C'
            : ab === 'IceSword'
            ? '#0284C7'
            : ab === 'ThunderSword'
            ? '#EAB308'
            : '#16A34A';
        ctx.beginPath();
        ctx.moveTo(centerX - 14, centerY - radius + 4);
        ctx.lineTo(centerX + 14, centerY - radius + 4);
        ctx.lineTo(centerX - 24 * player.facing, centerY - radius - 16);
        ctx.closePath();
        ctx.fill();

        // Sword blade in hand
        ctx.fillStyle = ab === 'FireSword' ? '#F97316' : ab === 'IceSword' ? '#38BDF8' : '#FDE047';
        ctx.fillRect(centerX + 16 * player.facing, centerY - 14, 24 * player.facing, 6);
      } else if (ab === 'Fire' || ab === 'FireBomb') {
        // Flame Crown
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - radius + 2);
        ctx.lineTo(centerX - 6, centerY - radius - 14);
        ctx.lineTo(centerX, centerY - radius);
        ctx.lineTo(centerX + 6, centerY - radius - 18);
        ctx.lineTo(centerX + 12, centerY - radius + 2);
        ctx.closePath();
        ctx.fill();
      } else if (ab === 'Ice' || ab === 'IceBomb') {
        // Ice Tiara
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(centerX - 12, centerY - radius - 8, 24, 10);
      } else if (ab === 'Spark') {
        // Electric headphones
        ctx.fillStyle = '#EAB308';
        ctx.fillRect(centerX - 16, centerY - 10, 6, 14);
        ctx.fillRect(centerX + 10, centerY - 10, 6, 14);
      }

      // Carrying chest over head
      if (player.carryingChest) {
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(centerX - 16, centerY - radius - 26, 32, 22);
        ctx.strokeStyle = '#D97706';
        ctx.strokeRect(centerX - 16, centerY - radius - 26, 32, 22);
      }
    }

    // 8. Render Particles
    for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
      const p = particles[pIdx];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) {
        particles.splice(pIdx, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  };

  return (
    <div className="w-full relative bg-black rounded-t-2xl overflow-hidden shadow-2xl border-4 border-b-0 border-slate-700">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto block bg-slate-900 object-cover"
      />

      {/* Action Screen HUD Overlay */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none select-none">
        {/* Left: HP & Ability Indicator */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow">
          {/* Kirby Portrait / Ability Icon */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shadow-inner"
            style={{
              backgroundColor: ABILITIES[playerState.currentAbility]?.color || '#F472B6',
            }}
          >
            {ABILITIES[playerState.currentAbility]?.icon || '🌸'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">
                {ABILITIES[playerState.currentAbility]?.name || '無能力'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                HP {playerState.hp}/{playerState.maxHp}
              </span>
            </div>
            {/* Health Meter */}
            <div className="w-24 sm:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-600 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-200"
                style={{
                  width: `${Math.max(0, Math.min(100, (playerState.hp / playerState.maxHp) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Heist & Chest status */}
        <div className="flex items-center gap-2">
          {playerState.carryingChest && (
            <div className="px-2.5 py-1 bg-amber-500/90 text-slate-950 font-bold text-xs rounded-lg shadow animate-bounce flex items-center gap-1">
              👑 扛著黃金大秘寶！
            </div>
          )}

          {playerState.mouthItem && (
            <div className="px-2.5 py-1 bg-pink-500/90 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1">
              👄 含住：{playerState.mouthItem} (按 S 吞入 / J 吐出)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
