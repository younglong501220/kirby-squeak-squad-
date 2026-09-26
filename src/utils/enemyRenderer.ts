/**
 * Procedural Sprite & Character Renderer for Kirby: Squeak Squad Web Edition
 * Dedicated rendering for all classic Kirby enemies and Nutty Rogue gang members.
 * Strictly NO flat rectangles: expressive eyes, hats, weapons, animated bobbing, accessories!
 */

import { Entity } from '../types/game';

export interface RenderEnemyContext {
  ctx: CanvasRenderingContext2D;
  ent: Entity;
  time: number; // for smooth idle animation / walk cycle
}

/**
 * 1. 瓦豆魯迪 (Waddle Dee) - 經典橘色圓滾滾小可愛
 */
export function drawWaddleDee(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bob = Math.sin(time * 0.08 + ent.x) * 2;
  const facing = ent.facing || 1;

  // 1. 褐色雙腳 (圓潤橢圓)
  ctx.fillStyle = '#C2410C'; // orange-700
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy + 11 + bob, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 8, cy + 11 + bob, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 圓滾滾橘色身體
  ctx.fillStyle = '#FB923C'; // orange-400
  ctx.beginPath();
  ctx.arc(cx, cy + bob, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#EA580C';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. 臉頰奶黃色心形面盤 (Waddle Dee 招牌心形膚色面孔)
  ctx.fillStyle = '#FEF08A'; // yellow-200
  ctx.beginPath();
  ctx.ellipse(cx + facing * 2, cy + 2 + bob, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. 水汪汪大眼睛 (黑色長橢圓 + 上方高光)
  ctx.fillStyle = '#0F172A';
  const eyeOffset = facing === 1 ? 2 : -4;
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffset, cy + bob, 2.5, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeOffset + facing * 6, cy + bob, 2.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛白色高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffset, cy - 2 + bob, 1.2, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeOffset + facing * 6, cy - 2 + bob, 1.2, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. 櫻粉色害羞腮紅
  ctx.fillStyle = '#F472B6';
  ctx.beginPath();
  ctx.arc(cx + eyeOffset - 4 * facing, cy + 4 + bob, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + eyeOffset + 8 * facing, cy + 4 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. 可愛小圓手
  ctx.fillStyle = '#FB923C';
  ctx.beginPath();
  ctx.arc(cx - 12, cy + 2 + bob, 4, 0, Math.PI * 2);
  ctx.arc(cx + 12, cy + 2 + bob, 4, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 2. 劍士騎士 (Sir Kibble) - 穿戴黃金盔甲與迴旋彎刀的勇士
 */
export function drawSirKibble(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bob = Math.sin(time * 0.09 + ent.x) * 1.5;
  const facing = ent.facing || 1;

  // 1. 金屬護足
  ctx.fillStyle = '#15803D'; // green-700
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy + 13 + bob, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 8, cy + 13 + bob, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 盔甲圓軀
  ctx.fillStyle = '#22C55E'; // green-500
  ctx.beginPath();
  ctx.arc(cx, cy + 2 + bob, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. 黃金頭盔面甲 (圓弧騎士盔)
  ctx.fillStyle = '#FACC15'; // yellow-400
  ctx.beginPath();
  ctx.arc(cx, cy - 3 + bob, 12, Math.PI * 0.9, Math.PI * 2.1);
  ctx.lineTo(cx, cy + 2 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#CA8A04';
  ctx.stroke();

  // 頭盔頂部標誌性的大月牙迴旋鏢刃 (Cutter Boomerang)
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.moveTo(cx - 8 * facing, cy - 14 + bob);
  ctx.quadraticCurveTo(cx - 16 * facing, cy - 24 + bob, cx + 4 * facing, cy - 22 + bob);
  ctx.quadraticCurveTo(cx - 4 * facing, cy - 16 + bob, cx + 8 * facing, cy - 13 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#EAB308';
  ctx.stroke();

  // 4. 頭盔面罩T字形視窗 (神秘黑底 + 銳利雙眼)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(cx + (facing === 1 ? -2 : -6), cy - 4 + bob, 8, 5, 2);
  ctx.fill();
  // 銳利黃光眼神
  ctx.fillStyle = '#FDE047';
  ctx.fillRect(cx + (facing === 1 ? 0 : -4), cy - 3 + bob, 2.5, 2.5);

  // 5. 佩戴的鋒利長劍 (附有金屬反光)
  ctx.save();
  ctx.translate(cx + 12 * facing, cy + 2 + bob);
  ctx.rotate(facing * 0.3);
  // 劍柄
  ctx.fillStyle = '#B45309';
  ctx.fillRect(-2, 4, 4, 7);
  // 護手
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(-6, 2, 12, 3);
  // 劍身
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(-3, 2);
  ctx.lineTo(0, -18);
  ctx.lineTo(3, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * 3. 烈火獸 (Hot Head) - 噴吐烈火的紅毛小獅獸
 */
export function drawHotHead(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bob = Math.sin(time * 0.1 + ent.x) * 2;
  const facing = ent.facing || 1;

  // 1. 深紅雙腳
  ctx.fillStyle = '#991B1B';
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy + 12 + bob, 6, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 8, cy + 12 + bob, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 圓滾滾紅色身軀
  ctx.fillStyle = '#EF4444'; // red-500
  ctx.beginPath();
  ctx.arc(cx, cy + 2 + bob, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. 頭頂不斷搖曳的熊熊火焰 (Flame Hair)
  const flameWiggle1 = Math.sin(time * 0.2) * 3;
  const flameWiggle2 = Math.cos(time * 0.25) * 2.5;

  // 外圈大火 (Orange-Red)
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 8 + bob);
  ctx.quadraticCurveTo(cx - 12 + flameWiggle1, cy - 24 + bob, cx + flameWiggle1, cy - 28 + bob);
  ctx.quadraticCurveTo(cx + 12 + flameWiggle2, cy - 20 + bob, cx + 10, cy - 8 + bob);
  ctx.closePath();
  ctx.fill();

  // 內圈核心熾烈黃火
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - 8 + bob);
  ctx.quadraticCurveTo(cx - 6 + flameWiggle2, cy - 18 + bob, cx + flameWiggle1 * 0.5, cy - 22 + bob);
  ctx.quadraticCurveTo(cx + 6 + flameWiggle1, cy - 15 + bob, cx + 5, cy - 8 + bob);
  ctx.closePath();
  ctx.fill();

  // 4. 大號喇叭狀火砲嘴 (Snout)
  ctx.fillStyle = '#FBBF24'; // amber-400
  ctx.beginPath();
  ctx.ellipse(cx + 8 * facing, cy + 4 + bob, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.arc(cx + 10 * facing, cy + 4 + bob, 3, 0, Math.PI * 2);
  ctx.fill();

  // 5. 熱血大眼
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(cx + 2 * facing, cy - 1 + bob, 2.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + 2 * facing, cy - 2 + bob, 1.2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 4. 炸彈小丑 (Poppy Bros. Jr.) - 戴著藍色尖頂小丑帽與紅白球球的敏捷炸彈客
 */
export function drawPoppyBros(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bob = Math.sin(time * 0.12 + ent.x) * 2;
  const facing = ent.facing || 1;

  // 1. 棕色小短靴
  ctx.fillStyle = '#92400E';
  ctx.beginPath();
  ctx.ellipse(cx - 7, cy + 12 + bob, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 7, cy + 12 + bob, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 圓滾滾身軀
  ctx.fillStyle = '#F59E0B'; // amber-500
  ctx.beginPath();
  ctx.arc(cx, cy + 3 + bob, 12, 0, Math.PI * 2);
  ctx.fill();

  // 3. 藍色小丑尖頂高帽 (Jester Cap)
  ctx.fillStyle = '#3B82F6'; // blue-500
  ctx.beginPath();
  ctx.moveTo(cx - 11, cy - 5 + bob);
  ctx.lineTo(cx + 11, cy - 5 + bob);
  ctx.quadraticCurveTo(cx + 8 * facing, cy - 22 + bob, cx - 18 * facing, cy - 20 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1D4ED8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 帽子頂端白絨毛球
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - 18 * facing, cy - 20 + bob, 4, 0, Math.PI * 2);
  ctx.fill();

  // 4. 白色小丑荷葉領 (Collar ruffle)
  ctx.fillStyle = '#FFFFFF';
  for (let r = -2; r <= 2; r++) {
    ctx.beginPath();
    ctx.arc(cx + r * 5, cy + 9 + bob, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. 調皮小丑臉 (微笑、大眼、小圓鼻)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(cx + 2 * facing, cy + 1 + bob, 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // 紅圓鼻
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(cx + 6 * facing, cy + 3 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. 手上抱著的黑色經典炸彈 (Classic Round Fuse Bomb)
  const bx = cx + 13 * facing;
  const by = cy + 4 + bob;
  ctx.fillStyle = '#1E293B'; // dark slate
  ctx.beginPath();
  ctx.arc(bx, by, 7, 0, Math.PI * 2);
  ctx.fill();
  // 導火線與火花
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx, by - 6);
  ctx.quadraticCurveTo(bx + 4 * facing, by - 12, bx + 7 * facing, by - 10);
  ctx.stroke();
  // 導火線閃爍小火花
  ctx.fillStyle = Math.random() > 0.5 ? '#FACC15' : '#EF4444';
  ctx.beginPath();
  ctx.arc(bx + 7 * facing, by - 10, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 5. 雪人奇利 (Chilly) - 頂著毛線帽與鈴鐺項圈的冰雪人
 */
export function drawChilly(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bob = Math.sin(time * 0.08 + ent.x) * 1.5;
  const facing = ent.facing || 1;

  // 1. 下半身大雪球
  ctx.fillStyle = '#E0F2FE'; // sky-100
  ctx.beginPath();
  ctx.arc(cx, cy + 7 + bob, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. 上半身小雪球
  ctx.fillStyle = '#F0F9FF';
  ctx.beginPath();
  ctx.arc(cx, cy - 3 + bob, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.stroke();

  // 3. 綠白條紋針織毛線帽 (Knit Beanie)
  ctx.fillStyle = '#16A34A'; // green-600
  ctx.beginPath();
  ctx.arc(cx, cy - 8 + bob, 9, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  // 帽沿
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(cx - 10, cy - 9 + bob, 20, 3);
  // 帽子頂端白毛球
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy - 18 + bob, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. 脖子上的紅項圈與黃金小鈴鐺 (Bell Collar)
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(cx - 8, cy + 1 + bob, 16, 2.5);
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.arc(cx + 2 * facing, cy + 3 + bob, 3, 0, Math.PI * 2);
  ctx.fill();

  // 5. 藍色豆豆眼與微腮紅
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.arc(cx + 1 * facing, cy - 3 + bob, 1.8, 0, Math.PI * 2);
  ctx.arc(cx + 6 * facing, cy - 3 + bob, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 6. 雪晶雪花飄散效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(cx - 11, cy + bob, 1.5, 0, Math.PI * 2);
  ctx.arc(cx + 12, cy - 6 + bob, 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 6. 火花精靈 (Sparky) - 充滿高壓電流彈跳的透明水滴球體
 */
export function drawSparky(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const bounce = Math.abs(Math.sin(time * 0.15 + ent.x)) * 6;
  const facing = ent.facing || 1;

  // 1. 電光金黃水滴型果凍身體
  ctx.fillStyle = '#FDE047'; // yellow-300
  ctx.beginPath();
  ctx.ellipse(cx, cy - bounce + 2, 13, 11 + bounce * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#EAB308';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. 身體外圍滋滋跳動的閃電折線 (Electric arcs)
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const arcOffset = (time * 0.3) % 4;
  ctx.moveTo(cx - 13, cy - bounce);
  ctx.lineTo(cx - 18, cy - bounce - 4);
  ctx.lineTo(cx - 15, cy - bounce - 10);
  ctx.moveTo(cx + 13, cy - bounce);
  ctx.lineTo(cx + 18, cy - bounce + 4);
  ctx.lineTo(cx + 16, cy - bounce + 10);
  ctx.stroke();

  // 3. 閃亮發光大眼
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(cx + 2 * facing, cy - bounce + 1, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + 7 * facing, cy - bounce + 1, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(cx + 2 * facing, cy - bounce, 1.5, 1.5);
  ctx.fillRect(cx + 7 * facing, cy - bounce, 1.5, 1.5);

  // 4. 頭頂閃電狀小觸角 (Antenna)
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - bounce - 9);
  ctx.lineTo(cx + 4, cy - bounce - 16);
  ctx.lineTo(cx - 1, cy - bounce - 18);
  ctx.lineTo(cx + 5, cy - bounce - 23);
  ctx.stroke();
  // 觸角尖端亮晶星
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + 5, cy - bounce - 23, 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 7. 怪盜小兵 (Squeaker Minion) - 松鼠怪盜團的可愛紅色小老鼠/小松鼠小嘍囉
 */
export function drawSqueaker(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const run = Math.sin(time * 0.2 + ent.x) * 3;
  const facing = ent.facing || 1;

  // 1. 蓬鬆細長松鼠尾巴 (Wavy tail)
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * facing, cy + 4);
  ctx.quadraticCurveTo(cx - 18 * facing, cy - 8 + run, cx - 14 * facing, cy - 16 + run);
  ctx.stroke();

  // 2. 紅色小松鼠身軀
  ctx.fillStyle = '#EF4444'; // red-500
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 11, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#B91C1C';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 3. 圓圓的大松鼠耳朵 (內耳粉色)
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(cx - 5, cy - 8, 4.5, 0, Math.PI * 2);
  ctx.arc(cx + 5, cy - 8, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FECDD3'; // rose-200
  ctx.beginPath();
  ctx.arc(cx - 5, cy - 8, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + 5, cy - 8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. 白色圓肚皮
  ctx.fillStyle = '#FEE2E2';
  ctx.beginPath();
  ctx.ellipse(cx + 2 * facing, cy + 4, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. 調皮黑眼球與小尖鼻
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(cx + 4 * facing, cy, 1.8, 0, Math.PI * 2);
  ctx.fill();
  // 尖鼻
  ctx.fillStyle = '#450A0A';
  ctx.beginPath();
  ctx.arc(cx + 9 * facing, cy + 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. 奔跑短腿
  ctx.fillStyle = '#991B1B';
  ctx.beginPath();
  ctx.ellipse(cx - 5 + run, cy + 11, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 5 - run, cy + 11, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 8. 怪盜刺客·斯派克 (Spike / Spinni) - 戴黃墨鏡、紅色紳士帽、手持雙爪手套的敏捷怪盜
 */
export function drawRogueSpike(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const run = Math.sin(time * 0.22 + ent.x) * 3;
  const facing = ent.facing || 1;

  // 1. 披風飄動 (Red/Dark Cape)
  ctx.fillStyle = '#7F1D1D';
  ctx.beginPath();
  ctx.moveTo(cx - 4 * facing, cy - 2);
  ctx.quadraticCurveTo(cx - 16 * facing, cy + 6 + run, cx - 22 * facing, cy + 18 + run);
  ctx.lineTo(cx - 6 * facing, cy + 14);
  ctx.closePath();
  ctx.fill();

  // 2. 刺客大松鼠身軀
  ctx.fillStyle = '#DC2626'; // red-600
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 14, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#991B1B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. 標誌性經典怪盜黑墨鏡/眼罩 (Thief Visor / Shades)
  ctx.fillStyle = '#0F172A'; // deep black
  ctx.beginPath();
  ctx.roundRect(cx - 8, cy - 2, 18 * facing, 7, 3);
  ctx.fill();
  // 鏡片黃金反光
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(cx - 4, cy - 1, 4 * facing, 4);

  // 4. 高雅怪盜紳士禮帽 (Rogue Top Hat)
  ctx.fillStyle = '#0F172A'; // hat base
  // 寬帽沿
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // 高圓頂
  ctx.fillRect(cx - 10, cy - 22, 20, 14);
  // 帽子紅絲帶 (Ribbon)
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(cx - 10, cy - 12, 20, 3.5);
  // 紳士帽羽毛裝飾 (Feather)
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 6 * facing, cy - 14);
  ctx.quadraticCurveTo(cx - 14 * facing, cy - 26, cx - 8 * facing, cy - 28);
  ctx.stroke();

  // 5. 標誌性鋒利利爪手套 (Claws Weapon)
  const clawX = cx + 14 * facing;
  const clawY = cy + 4;
  ctx.fillStyle = '#CBD5E1';
  for (let c = -1; c <= 1; c++) {
    ctx.beginPath();
    ctx.moveTo(clawX, clawY + c * 4);
    ctx.lineTo(clawX + 8 * facing, clawY + c * 3);
    ctx.lineTo(clawX, clawY + c * 4 + 2);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * 9. 怪盜團首領·男爵 (Baron Squeak / Daroach)
 * 手持三元魔導杖、身披華麗紫紅色燕尾披風、戴著羽飾魔術大禮帽與白鬍鬚的紳士首領！
 */
export function drawBaronSqueak(ctx: CanvasRenderingContext2D, ent: Entity, time: number) {
  const cx = ent.x + ent.w / 2;
  const cy = ent.y + ent.h / 2;
  const floatBob = Math.sin(time * 0.08) * 3;
  const facing = ent.facing || -1;

  // 1. 飄逸的深紫紅色燕尾披風 (Flowing Royal Cape)
  ctx.fillStyle = '#581C87'; // purple-900
  ctx.beginPath();
  ctx.moveTo(cx - 6 * facing, cy - 8 + floatBob);
  ctx.quadraticCurveTo(cx - 28 * facing, cy + 10 + floatBob, cx - 26 * facing, cy + 30 + floatBob);
  ctx.lineTo(cx - 8 * facing, cy + 24 + floatBob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. 身軀 (穿著整齊黑色晚禮服背心)
  ctx.fillStyle = '#7E22CE'; // purple-700
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6 + floatBob, 17, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4C1D95';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 白色襯衫與紅色領結 (Bowtie & Shirt)
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy - 4 + floatBob);
  ctx.lineTo(cx + 6, cy - 4 + floatBob);
  ctx.lineTo(cx, cy + 6 + floatBob);
  ctx.closePath();
  ctx.fill();
  // 紅領結
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(cx, cy - 3 + floatBob, 3, 0, Math.PI * 2);
  ctx.fill();

  // 3. 威嚴紳士八字白鬍鬚 (Signature Gentleman Moustache)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx - 7 * facing, cy + 2 + floatBob, 7, 3, facing * 0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + 7 * facing, cy + 2 + floatBob, 7, 3, -facing * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 4. 神秘而銳利的金色眼眸 (Golden glowing eyes)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(cx + 3 * facing, cy - 5 + floatBob, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.arc(cx + 3 * facing, cy - 5 + floatBob, 2, 0, Math.PI * 2);
  ctx.fill();

  // 5. 華麗魔術羽飾高禮帽 (Grand Arch-Thief Top Hat)
  ctx.fillStyle = '#1E1B4B'; // dark indigo
  // 寬大帽沿
  ctx.beginPath();
  ctx.ellipse(cx, cy - 12 + floatBob, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // 挺拔帽筒
  ctx.beginPath();
  ctx.roundRect(cx - 13, cy - 32 + floatBob, 26, 20, [4, 4, 0, 0]);
  ctx.fill();
  // 金邊與紅絲帶
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(cx - 13, cy - 17 + floatBob, 26, 4.5);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(cx - 13, cy - 13 + floatBob, 26, 1.5);
  // 帽子插著的華麗金色寶石與雪白長羽毛
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(cx - 8 * facing, cy - 22 + floatBob, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * facing, cy - 22 + floatBob);
  ctx.quadraticCurveTo(cx - 20 * facing, cy - 36 + floatBob, cx - 14 * facing, cy - 44 + floatBob);
  ctx.stroke();

  // 6. 手持的「三元星芒魔導杖」(Triple Star Magic Wand)
  const wandX = cx + 18 * facing;
  const wandY = cy - 2 + floatBob;
  // 杖身
  ctx.strokeStyle = '#CA8A04'; // gold metal
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(wandX, wandY + 22);
  ctx.lineTo(wandX, wandY - 14);
  ctx.stroke();
  // 杖頂魔力星辰寶石
  ctx.fillStyle = '#A855F7'; // purple magic orb
  ctx.beginPath();
  ctx.arc(wandX, wandY - 15, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(wandX - 1.5, wandY - 17, 2, 0, Math.PI * 2);
  ctx.fill();

  // 閃爍魔力星芒
  const starGlow = (Math.sin(time * 0.15) + 1) * 0.5;
  ctx.fillStyle = `rgba(250, 204, 21, ${0.4 + starGlow * 0.5})`;
  ctx.beginPath();
  ctx.arc(wandX, wandY - 15, 9 + starGlow * 3, 0, Math.PI * 2);
  ctx.fill();
}
