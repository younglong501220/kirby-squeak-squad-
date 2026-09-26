import { Entity, StageConfig } from '../types/game';

export interface StageData {
  config: StageConfig;
  entities: Entity[];
  solids: { x: number; y: number; w: number; h: number; type?: string; color?: string }[];
  waters: { x: number; y: number; w: number; h: number; isFrozen?: boolean }[];
  goalDoor: { x: number; y: number; w: number; h: number };
  heistTriggered: boolean;
  spawnPoint: { x: number; y: number };
}

export function buildStage(stageId: number): StageData {
  if (stageId === 1) {
    return buildStage1();
  } else if (stageId === 2) {
    return buildStage2();
  } else {
    return buildStage3();
  }
}

function buildStage1(): StageData {
  const solids = [
    // Main ground
    { x: 0, y: 400, w: 900, h: 80 },
    // Slight hill
    { x: 420, y: 340, w: 120, h: 60 },
    // Platform floating
    { x: 260, y: 290, w: 140, h: 22 },
    { x: 600, y: 270, w: 160, h: 22 },
    // Pit gap
    { x: 980, y: 400, w: 700, h: 80 },
    // Upper secret cliff
    { x: 1100, y: 250, w: 220, h: 24 },
    // Second ground continuation
    { x: 1740, y: 400, w: 700, h: 80 },
    // End hill
    { x: 2000, y: 340, w: 180, h: 60 },
  ];

  const waters = [
    // Water pond at gap
    { x: 890, y: 410, w: 100, h: 70, isFrozen: false },
    { x: 1670, y: 410, w: 80, h: 70, isFrozen: false },
  ];

  const entities: Entity[] = [
    // Food & item tutorials
    {
      id: 'food-1',
      type: 'item',
      itemType: 'FoodCherry',
      name: '櫻桃',
      x: 310,
      y: 255,
      w: 24,
      h: 24,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing: 1,
      color: '#F43F5E',
    },
    // Sword Knight (Sir Kibble)
    {
      id: 'enemy-sword-1',
      type: 'enemy',
      subType: 'SirKibble',
      ability: 'Sword',
      name: '劍士騎士',
      x: 460,
      y: 300,
      w: 32,
      h: 36,
      vx: -1,
      vy: 0,
      hp: 25,
      maxHp: 25,
      facing: -1,
      color: '#22C55E',
      state: 'patrol',
      aiTimer: 0,
    },
    // Waddle Dee
    {
      id: 'enemy-dee-1',
      type: 'enemy',
      subType: 'WaddleDee',
      name: '瓦豆魯迪',
      x: 700,
      y: 364,
      w: 28,
      h: 28,
      vx: 1,
      vy: 0,
      hp: 15,
      maxHp: 15,
      facing: 1,
      color: '#FB923C',
      state: 'patrol',
      aiTimer: 0,
    },
    // Fire Lion (Hot Head)
    {
      id: 'enemy-fire-1',
      type: 'enemy',
      subType: 'HotHead',
      ability: 'Fire',
      name: '烈火獸',
      x: 780,
      y: 360,
      w: 32,
      h: 34,
      vx: -1,
      vy: 0,
      hp: 30,
      maxHp: 30,
      facing: -1,
      color: '#EF4444',
      state: 'patrol',
      aiTimer: 0,
    },
    // Bomb Tosser (Poppy Bros)
    {
      id: 'enemy-bomb-1',
      type: 'enemy',
      subType: 'PoppyBros',
      ability: 'Bomb',
      name: '炸彈小丑',
      x: 1040,
      y: 360,
      w: 30,
      h: 34,
      vx: 1,
      vy: 0,
      hp: 28,
      maxHp: 28,
      facing: 1,
      color: '#6366F1',
      state: 'patrol',
      aiTimer: 0,
    },
    // Wooden Bramble Barrier guarding Golden Chest! Requires Fire or FireSword to burn!
    {
      id: 'block-bramble-1',
      type: 'interactive_block',
      blockType: 'bramble',
      name: '枯木荊棘閘門',
      x: 1220,
      y: 190,
      w: 32,
      h: 60,
      vx: 0,
      vy: 0,
      hp: 20,
      maxHp: 20,
      facing: 1,
      color: '#78350F',
    },
    // Golden Chest inside the secret alcove!
    {
      id: 'chest-golden-1',
      type: 'chest',
      itemType: 'GoldenChest',
      name: '黃金大秘寶',
      x: 1280,
      y: 208,
      w: 36,
      h: 36,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      facing: 1,
      color: '#F59E0B',
    },
    // Silver chest at secret bottom
    {
      id: 'chest-silver-1',
      type: 'chest',
      itemType: 'SilverChest',
      name: '銀色秘寶',
      x: 1450,
      y: 364,
      w: 30,
      h: 30,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      facing: 1,
      color: '#94A3B8',
    },
    // Another Sword Knight
    {
      id: 'enemy-sword-2',
      type: 'enemy',
      subType: 'SirKibble',
      ability: 'Sword',
      name: '劍士騎士',
      x: 1820,
      y: 360,
      w: 32,
      h: 36,
      vx: -1,
      vy: 0,
      hp: 25,
      maxHp: 25,
      facing: -1,
      color: '#22C55E',
      state: 'patrol',
      aiTimer: 0,
    },
    // Escape burrow for thieves
    {
      id: 'burrow-1',
      type: 'hazard',
      name: '怪盜地洞秘密基地',
      x: 2180,
      y: 350,
      w: 48,
      h: 48,
      vx: 0,
      vy: 0,
      hp: 9999,
      maxHp: 9999,
      facing: 1,
      color: '#451A03',
    },
  ];

  return {
    config: {
      id: 1,
      title: '第一關：綠色微風平原',
      subtitle: 'Sunny Green Meadows',
      theme: 'meadow',
      width: 2400,
      height: 480,
      bgGradient: ['#38BDF8', '#86EFAC'],
      hasGoldenChest: true,
      hasSilverChest: true,
      musicTrack: 'stage1',
      chestReward: {
        type: 'scroll',
        title: '劍士奧義秘卷 📜',
        description: '長劍附魔強化！解鎖【滿血劍氣】與強化斬擊，威力大幅提升！',
        abilityTarget: 'Sword',
      },
    },
    entities,
    solids,
    waters,
    goalDoor: { x: 2280, y: 320, w: 48, h: 80 },
    heistTriggered: false,
    spawnPoint: { x: 80, y: 340 },
  };
}

function buildStage2(): StageData {
  const solids = [
    { x: 0, y: 400, w: 600, h: 80 },
    // Hanging crystal ceilings
    { x: 400, y: 0, w: 180, h: 120 },
    { x: 1000, y: 0, w: 260, h: 100 },
    // Crystal steps
    { x: 480, y: 330, w: 140, h: 24 },
    { x: 680, y: 260, w: 140, h: 24 },
    // Spiked pit floor with huge freezing water lake
    { x: 860, y: 400, w: 650, h: 80 },
    // High electric platform
    { x: 1100, y: 220, w: 220, h: 24 },
    // Sealed blast door platform
    { x: 1580, y: 400, w: 1000, h: 80 },
    { x: 1720, y: 320, w: 160, h: 30 },
  ];

  const waters = [
    // Water basin across spike gap (Freeze with Ice or Ice Sword to cross!)
    { x: 600, y: 410, w: 260, h: 70, isFrozen: false },
    { x: 1510, y: 410, w: 70, h: 70, isFrozen: false },
  ];

  const entities: Entity[] = [
    // Ice Snowman (Chilly)
    {
      id: 'enemy-ice-1',
      type: 'enemy',
      subType: 'Chilly',
      ability: 'Ice',
      name: '雪人奇利',
      x: 320,
      y: 360,
      w: 32,
      h: 36,
      vx: -1,
      vy: 0,
      hp: 30,
      maxHp: 30,
      facing: -1,
      color: '#38BDF8',
      state: 'patrol',
      aiTimer: 0,
    },
    // Sparky (Electric)
    {
      id: 'enemy-spark-1',
      type: 'enemy',
      subType: 'Sparky',
      ability: 'Spark',
      name: '火花精靈',
      x: 520,
      y: 290,
      w: 28,
      h: 28,
      vx: 1,
      vy: 0,
      hp: 25,
      maxHp: 25,
      facing: 1,
      color: '#EAB308',
      state: 'patrol',
      aiTimer: 0,
    },
    // Sword Knight
    {
      id: 'enemy-sword-3',
      type: 'enemy',
      subType: 'SirKibble',
      ability: 'Sword',
      name: '劍士騎士',
      x: 720,
      y: 220,
      w: 32,
      h: 36,
      vx: -1,
      vy: 0,
      hp: 25,
      maxHp: 25,
      facing: -1,
      color: '#22C55E',
      state: 'patrol',
      aiTimer: 0,
    },
    // Electric Switch (Needs Spark or ThunderSword to trigger)
    {
      id: 'switch-electric-1',
      type: 'interactive_block',
      blockType: 'switch',
      name: '古代電路開關',
      x: 1260,
      y: 180,
      w: 36,
      h: 36,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing: 1,
      color: '#FACC15',
      isActivated: false,
    },
    // Dynamite Barrel
    {
      id: 'dynamite-1',
      type: 'interactive_block',
      blockType: 'dynamite',
      name: '烈性炸藥桶',
      x: 1040,
      y: 364,
      w: 32,
      h: 36,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing: 1,
      color: '#DC2626',
    },
    // Golden Chest
    {
      id: 'chest-golden-2',
      type: 'chest',
      itemType: 'GoldenChest',
      name: '黃金大秘寶',
      x: 1780,
      y: 275,
      w: 36,
      h: 36,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      facing: 1,
      color: '#F59E0B',
    },
    // Strawberry Cake food
    {
      id: 'food-cake-1',
      type: 'item',
      itemType: 'FoodCake',
      name: '草莓蛋糕',
      x: 1840,
      y: 285,
      w: 24,
      h: 24,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing: 1,
      color: '#FB7185',
    },
    // Silver chest
    {
      id: 'chest-silver-2',
      type: 'chest',
      itemType: 'SilverChest',
      name: '銀色秘寶',
      x: 2100,
      y: 364,
      w: 30,
      h: 30,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      facing: 1,
      color: '#94A3B8',
    },
    // Escape burrow for thieves
    {
      id: 'burrow-2',
      type: 'hazard',
      name: '怪盜地洞秘密基地',
      x: 2360,
      y: 350,
      w: 48,
      h: 48,
      vx: 0,
      vy: 0,
      hp: 9999,
      maxHp: 9999,
      facing: 1,
      color: '#451A03',
    },
  ];

  return {
    config: {
      id: 2,
      title: '第二關：冰川晶石窟',
      subtitle: 'Frosty Crystal Cavern',
      theme: 'cavern',
      width: 2600,
      height: 480,
      bgGradient: ['#1E1B4B', '#312E81'],
      hasGoldenChest: true,
      hasSilverChest: true,
      musicTrack: 'stage2',
      chestReward: {
        type: 'scroll',
        title: '火焰奧義秘卷 📜',
        description: '火焰衝刺進化為【不死鳥烈焰】，撞擊時產生巨大範圍爆震！',
        abilityTarget: 'Fire',
      },
    },
    entities,
    solids,
    waters,
    goalDoor: { x: 2480, y: 320, w: 48, h: 80 },
    heistTriggered: false,
    spawnPoint: { x: 80, y: 340 },
  };
}

function buildStage3(): StageData {
  const solids = [
    { x: 0, y: 400, w: 600, h: 80 },
    // Flying airship floating decks
    { x: 420, y: 280, w: 180, h: 24 },
    { x: 680, y: 220, w: 200, h: 24 },
    { x: 960, y: 300, w: 220, h: 24 },
    // Central fortress hall
    { x: 1260, y: 400, w: 1500, h: 80 },
    // Throne pediment
    { x: 1800, y: 320, w: 240, h: 30 },
  ];

  const waters: { x: number; y: number; w: number; h: number; isFrozen?: boolean }[] = [];

  const entities: Entity[] = [
    // Sword Knight
    {
      id: 'enemy-sword-boss-1',
      type: 'enemy',
      subType: 'SirKibble',
      ability: 'Sword',
      name: '親衛劍士',
      x: 480,
      y: 240,
      w: 32,
      h: 36,
      vx: 1,
      vy: 0,
      hp: 35,
      maxHp: 35,
      facing: 1,
      color: '#22C55E',
      state: 'patrol',
      aiTimer: 0,
    },
    // Fire Lion
    {
      id: 'enemy-fire-boss-1',
      type: 'enemy',
      subType: 'HotHead',
      ability: 'Fire',
      name: '親衛炎獅',
      x: 740,
      y: 180,
      w: 32,
      h: 34,
      vx: -1,
      vy: 0,
      hp: 35,
      maxHp: 35,
      facing: -1,
      color: '#EF4444',
      state: 'patrol',
      aiTimer: 0,
    },
    // Sparky
    {
      id: 'enemy-spark-boss-1',
      type: 'enemy',
      subType: 'Sparky',
      ability: 'Spark',
      name: '雷光機巧',
      x: 1020,
      y: 260,
      w: 28,
      h: 28,
      vx: 1,
      vy: 0,
      hp: 30,
      maxHp: 30,
      facing: 1,
      color: '#EAB308',
      state: 'patrol',
      aiTimer: 0,
    },
    // Maxim Tomato before boss!
    {
      id: 'food-tomato-boss',
      type: 'item',
      itemType: 'MaximTomato',
      name: '全滿番茄',
      x: 1320,
      y: 360,
      w: 28,
      h: 28,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      facing: 1,
      color: '#EF4444',
    },
    // Boss: Baron Squeak (多洛奇首領男爵)
    {
      id: 'boss-baron-squeak',
      type: 'boss',
      subType: 'BaronSqueak',
      name: '怪盜首領·男爵 (Baron Squeak)',
      x: 1960,
      y: 260,
      w: 48,
      h: 58,
      vx: 0,
      vy: 0,
      hp: 300,
      maxHp: 300,
      facing: -1,
      color: '#7E22CE', // purple
      state: 'idle',
      aiTimer: 0,
      attackCooldown: 60,
    },
    // Ultimate Strawberry Shortcake Master Golden Chest!
    {
      id: 'chest-golden-3',
      type: 'chest',
      itemType: 'GoldenChest',
      name: '究極草莓千層酥寶箱',
      x: 1880,
      y: 275,
      w: 40,
      h: 40,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      facing: 1,
      color: '#F59E0B',
    },
    // Escape air portal
    {
      id: 'burrow-3',
      type: 'hazard',
      name: '飛船逃生傳送艙',
      x: 2320,
      y: 340,
      w: 52,
      h: 56,
      vx: 0,
      vy: 0,
      hp: 9999,
      maxHp: 9999,
      facing: 1,
      color: '#4C1D95',
    },
  ];

  return {
    config: {
      id: 3,
      title: '第三關：怪盜飛空要塞',
      subtitle: 'Rogues Flying Fortress',
      theme: 'fortress',
      width: 2800,
      height: 480,
      bgGradient: ['#311042', '#701A75'],
      hasGoldenChest: true,
      hasSilverChest: false,
      musicTrack: 'boss',
      chestReward: {
        type: 'cake',
        title: '究極草莓千層酥 🍰👑',
        description: '奪回了被怪盜團首領竊走的夢幻草莓千層酥！波波享受最幸福的下午茶時光！',
      },
    },
    entities,
    solids,
    waters,
    goalDoor: { x: 2620, y: 320, w: 52, h: 80 },
    heistTriggered: false,
    spawnPoint: { x: 80, y: 340 },
  };
}
