import { AbilityType, ItemType, StomachBubble } from '../types/game';
import { ABILITIES } from './constants';

export interface FusionResult {
  canFuse: boolean;
  resultBubble?: StomachBubble;
  name: string;
  description: string;
}

export function evaluateFusion(itemA: StomachBubble, itemB: StomachBubble): FusionResult {
  const typeA = itemA.ability || itemA.itemType;
  const typeB = itemB.ability || itemB.itemType;

  // Cannot fuse chests
  if (itemA.isSpecialChest || itemB.isSpecialChest) {
    return {
      canFuse: false,
      name: '秘寶寶箱不可融合',
      description: '大寶箱與小寶箱是關卡珍貴道具，無法在胃袋中融化。',
    };
  }

  // Food + Food => Maxim Tomato (🍅)
  const isFoodA = itemA.itemType === 'FoodCherry' || itemA.itemType === 'FoodCake' || itemA.itemType === 'MaximTomato';
  const isFoodB = itemB.itemType === 'FoodCherry' || itemB.itemType === 'FoodCake' || itemB.itemType === 'MaximTomato';
  if (isFoodA && isFoodB) {
    return {
      canFuse: true,
      name: '全滿全餐番茄 (Maxim Tomato)',
      description: '兩個美食氣泡融合成最高級夢幻番茄，吃下後瞬間 100% 生命全滿！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'MaximTomato',
        title: '全滿番茄',
        icon: '🍅',
        color: '#EF4444',
        accentColor: '#DC2626',
        description: '恢復 100% 全部生命值！',
        healAmount: 100,
      },
    };
  }

  // Helper matching set
  const match = (x: string, y: string) =>
    (typeA === x && typeB === y) || (typeA === y && typeB === x);

  // Fire + Sword => FireSword
  if (match('Fire', 'Sword')) {
    const ab = ABILITIES.FireSword;
    return {
      canFuse: true,
      name: '烈焰劍 🔥⚔️',
      description: '揮舞附帶猛烈烈火的聖劍，斬斷藤蔓與燃燒全場！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'FireSword',
        ability: 'FireSword',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  // Ice + Sword => IceSword
  if (match('Ice', 'Sword')) {
    const ab = ABILITIES.IceSword;
    return {
      canFuse: true,
      name: '寒冰劍 ❄️⚔️',
      description: '刺骨冰晶之刃，揮劍發射冰霜劍氣並將水面瞬間化為冰雪！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'IceSword',
        ability: 'IceSword',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  // Spark + Sword => ThunderSword
  if (match('Spark', 'Sword')) {
    const ab = ABILITIES.ThunderSword;
    return {
      canFuse: true,
      name: '雷霆劍 ⚡⚔️',
      description: '十萬伏特閃電劍，揮劍引發連鎖電弧打擊群敵，遠程啟動電路！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'ThunderSword',
        ability: 'ThunderSword',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  // Fire + Bomb => FireBomb
  if (match('Fire', 'Bomb')) {
    const ab = ABILITIES.FireBomb;
    return {
      canFuse: true,
      name: '火焰爆彈 🔥💣',
      description: '爆炸留下大片燃燒火海，對敵人和障礙造成持續重創！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'FireBomb',
        ability: 'FireBomb',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  // Ice + Bomb => IceBomb
  if (match('Ice', 'Bomb')) {
    const ab = ABILITIES.IceBomb;
    return {
      canFuse: true,
      name: '寒冰爆彈 ❄️💣',
      description: '低溫急凍炸彈，引爆時瞬間把周遭所有敵人全部急凍成冰塊！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'IceBomb',
        ability: 'IceBomb',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  // Same ability fusion or Ability + Food or random abilities => SuperStar!
  if (typeA === typeB || itemA.ability || itemB.ability) {
    const ab = ABILITIES.SuperStar;
    return {
      canFuse: true,
      name: '大超星 🌟',
      description: '兩大能力共鳴誕生的超級星星，釋放可產生毀滅全場的流星雨！',
      resultBubble: {
        id: `bubble-${Date.now()}-${Math.random()}`,
        itemType: 'SuperStar',
        ability: 'SuperStar',
        title: ab.name,
        icon: ab.icon,
        color: ab.color,
        accentColor: ab.accentColor,
        description: ab.description,
      },
    };
  }

  return {
    canFuse: false,
    name: '無法融合',
    description: '試著將【火/冰/雷】與【劍】或【火/冰】與【炸彈】拖曳在一起！',
  };
}

export function createBubbleFromItem(itemType: ItemType): StomachBubble {
  if (itemType === 'GoldenChest') {
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      itemType: 'GoldenChest',
      title: '黃金大秘寶',
      icon: '👑📦',
      color: '#F59E0B',
      accentColor: '#D97706',
      description: '怪盜松鼠旅團夢寐以求的關卡大寶箱！通關後可解鎖能力秘卷或蛋糕碎片！',
      isSpecialChest: true,
    };
  }

  if (itemType === 'SilverChest') {
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      itemType: 'SilverChest',
      title: '銀色小秘寶',
      icon: '💎📦',
      color: '#94A3B8',
      accentColor: '#64748B',
      description: '關卡隱藏的銀色寶箱，通關可獲得額外生命或大星星！',
      isSpecialChest: true,
    };
  }

  if (itemType === 'FoodCherry') {
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      itemType: 'FoodCherry',
      title: '雙子櫻桃',
      icon: '🍒',
      color: '#F43F5E',
      accentColor: '#E11D48',
      description: '甘甜可口的水果，點擊吃下可恢復 25% 生命值。',
      healAmount: 25,
    };
  }

  if (itemType === 'FoodCake') {
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      itemType: 'FoodCake',
      title: '草莓小蛋糕',
      icon: '🍰',
      color: '#FB7185',
      accentColor: '#F43F5E',
      description: '美味的草莓戚風蛋糕，點擊吃下可恢復 50% 生命值！',
      healAmount: 50,
    };
  }

  if (itemType === 'MaximTomato') {
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      itemType: 'MaximTomato',
      title: '全滿番茄',
      icon: '🍅',
      color: '#EF4444',
      accentColor: '#DC2626',
      description: '帶有 M 標誌的神奇番茄，點擊直接恢復 100% 生命！',
      healAmount: 100,
    };
  }

  const ab = ABILITIES[itemType as AbilityType] || ABILITIES.Normal;
  return {
    id: `bubble-${Date.now()}-${Math.random()}`,
    itemType,
    ability: itemType as AbilityType,
    title: ab.name,
    icon: ab.icon,
    color: ab.color,
    accentColor: ab.accentColor,
    description: ab.description,
  };
}
