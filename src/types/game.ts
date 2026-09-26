/**
 * Game Types for Kirby: Squeak Squad Web Edition
 * (星之卡比 參上！怪盜團)
 */

export type AbilityType =
  | 'Normal'
  | 'Sword'
  | 'Fire'
  | 'Ice'
  | 'Spark'
  | 'Bomb'
  | 'FireSword'
  | 'IceSword'
  | 'ThunderSword'
  | 'FireBomb'
  | 'IceBomb'
  | 'SuperStar';

export type ItemType =
  | AbilityType
  | 'FoodCherry'
  | 'FoodCake'
  | 'MaximTomato'
  | 'GoldenChest'
  | 'SilverChest';

export interface AbilityDetails {
  id: AbilityType;
  name: string;
  nameEn: string;
  color: string;
  accentColor: string;
  icon: string;
  description: string;
  moves: string[];
  isFused?: boolean;
}

export interface StomachBubble {
  id: string;
  itemType: ItemType;
  ability?: AbilityType;
  title: string;
  icon: string;
  color: string;
  accentColor: string;
  description: string;
  healAmount?: number;
  isSpecialChest?: boolean;
}

export interface Entity {
  id: string;
  type:
    | 'enemy'
    | 'rogue'
    | 'boss'
    | 'item'
    | 'chest'
    | 'projectile'
    | 'star'
    | 'hazard'
    | 'interactive_block';
  subType?: string;
  ability?: AbilityType;
  itemType?: ItemType;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  color: string;
  name: string;
  isGrounded?: boolean;
  isBeingInhaled?: boolean;
  isInhaled?: boolean;
  invincibleTimer?: number;
  state?: 'idle' | 'patrol' | 'chase' | 'flee' | 'holding_chest' | 'attack' | 'stunned' | 'frozen';
  attackCooldown?: number;
  aiTimer?: number;
  targetX?: number;
  targetY?: number;
  isCarried?: boolean;
  carrierId?: string;
  blockType?: 'bramble' | 'ice' | 'dynamite' | 'switch' | 'star_block';
  isActivated?: boolean;
  frozenTimer?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'smoke' | 'spark' | 'sparkle' | 'flame' | 'ice';
  rotation?: number;
  vRot?: number;
}

export interface PlayerState {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  isGrounded: boolean;
  isFloating: boolean;
  floatFlapTimer: number;
  isCrouching: boolean;
  isSliding: boolean;
  slideTimer: number;
  isInhaling: boolean;
  inhaleTimer: number;
  mouthItem: ItemType | null;
  currentAbility: AbilityType;
  stomach: StomachBubble[];
  carryingChest: boolean;
  invincibleTimer: number;
  attackTimer: number;
  attackType: string | null;
  score: number;
  isAlive: boolean;
}

export interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  theme: 'meadow' | 'cavern' | 'fortress';
  width: number;
  height: number;
  bgGradient: [string, string];
  hasGoldenChest: boolean;
  hasSilverChest: boolean;
  musicTrack: 'stage1' | 'stage2' | 'boss';
  chestReward: {
    type: 'scroll' | 'cake' | 'heart';
    title: string;
    description: string;
    abilityTarget?: AbilityType;
  };
}

export type GameView =
  | 'TITLE'
  | 'STAGE_SELECT'
  | 'PLAYING'
  | 'CHEST_OPEN'
  | 'STAGE_CLEAR'
  | 'GAME_OVER'
  | 'COLLECTION';
