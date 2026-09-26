import React from 'react';
import { X, HelpCircle, Gamepad2, Sparkles, PackageOpen } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-bold text-white">遊戲操作與系統秘訣</h2>
        </div>

        {/* Keyboard Controls */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
            基本按鍵操作 (Controls)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">移動 / 奔跑</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                A / D 或 方向鍵
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">跳躍 / 飄浮飛行</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                W 或 空白鍵
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">長按：吸入 (Inhale)</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                長按 J
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">吐出星彈 / 技能攻擊</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                短按 J
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">吞入胃袋氣泡</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                S 或 下鍵
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">滑踢 (Slide Kick)</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-pink-300 font-mono font-bold rounded border border-slate-700">
                下 + J
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">快速自動融合</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono font-bold rounded border border-slate-700">
                E
              </kbd>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">收納當前能力回胃袋</span>
              <kbd className="px-2 py-0.5 bg-slate-800 text-emerald-300 font-mono font-bold rounded border border-slate-700">
                C
              </kbd>
            </div>
          </div>
        </div>

        {/* Core Mechanic Pillars */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-pink-950/30 border border-pink-500/30 rounded-xl">
            <h4 className="font-bold text-pink-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              1. 胃袋氣泡拖曳融合 (Belly Fusion)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              在下方的胃袋螢幕中，用滑鼠或手指直接把一個氣泡拖到另一個氣泡上，就能融合出強大的複合能力！例如【火焰
              + 劍士 = 烈焰劍】。點擊氣泡即可直接裝備或食用！
            </p>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
            <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              👑 2. 怪盜秘寶爭奪戰 (Chest Heist)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              關卡裡藏有金光閃閃的黃金大寶箱！一旦拾起，怪盜松鼠旅團全員將殺出搶奪。受到重擊寶箱會脫落，盜賊撿到會立刻扛回地洞基地，必須迅速擊暈盜賊搶回寶箱！
            </p>
          </div>

          <div className="p-3 bg-sky-950/30 border border-sky-500/30 rounded-xl">
            <h4 className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
              ❄️ 3. 屬性環境互動
            </h4>
            <p className="text-slate-300 leading-relaxed">
              • 【火焰 / 烈焰劍 / 炸彈】：能燒毀枯木荊棘阻擋，點燃炸藥桶引線。<br />
              • 【寒冰 / 寒冰劍】：可將敵人凍結成滑動冰塊，凍結水面化為冰橋。<br />
              • 【電擊 / 雷霆劍】：能隔空導電啟動古代電極開關，打開密室大門！
            </p>
          </div>
        </div>

        {/* Enemy Bestiary Gallery Section */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 flex items-center gap-1.5">
            👾 敵人與怪盜圖鑑 (Enemy & Rogue Bestiary)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-400 border border-orange-600 flex items-center justify-center text-sm shrink-0">
                🌰
              </div>
              <div>
                <div className="font-bold text-orange-300">瓦豆魯迪 (Waddle Dee)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  橘色心形面盤、棕色小腳丫的經典小可愛，吸入可噴射星彈！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-700 flex items-center justify-center text-sm shrink-0">
                ⚔️
              </div>
              <div>
                <div className="font-bold text-emerald-300">劍士騎士 (Sir Kibble)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  黃金彎刀騎士盔、佩戴鋒利長劍與綠色鎧甲，吞下可獲得【劍士】能力！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-500 border border-red-700 flex items-center justify-center text-sm shrink-0">
                🔥
              </div>
              <div>
                <div className="font-bold text-red-300">烈火獸 (Hot Head)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  頭頂搖曳熊熊火焰毛髮、大喇叭火砲嘴，吞下可獲得【火焰】能力！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-700 flex items-center justify-center text-sm shrink-0">
                💣
              </div>
              <div>
                <div className="font-bold text-amber-300">炸彈小丑 (Poppy Bros. Jr.)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  藍色尖頂小丑帽與白色荷葉領，手上抱著導火線炸彈，吞下獲得【炸彈】！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-200 border border-sky-400 flex items-center justify-center text-sm shrink-0">
                ☃️
              </div>
              <div>
                <div className="font-bold text-sky-300">雪人奇利 (Chilly)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  綠黃條紋針織毛線帽、脖子繫著紅項圈與黃金鈴鐺，吞下獲得【寒冰】！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center text-sm shrink-0">
                ⚡
              </div>
              <div>
                <div className="font-bold text-yellow-300">火花精靈 (Sparky)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  彈跳的晶瑩電光果凍球體，頭頂閃電觸角，吞下獲得【電擊】！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-600 border border-rose-400 flex items-center justify-center text-sm shrink-0">
                🐿️
              </div>
              <div>
                <div className="font-bold text-rose-300">怪盜小兵 (Squeaker)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  松鼠怪盜團紅色小松鼠嘍囉，長尾巴、大耳朵，會疾跑搶奪大寶箱！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-700 border border-red-500 flex items-center justify-center text-sm shrink-0">
                🎩
              </div>
              <div>
                <div className="font-bold text-rose-300">怪盜刺客·斯派克 (Spike)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  戴金色反光護目鏡、高雅黑色紳士帽、手持鋼鐵利爪手套的敏捷怪盜幹部！
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-purple-950/50 border border-purple-500/50 rounded-xl flex items-start gap-2.5 sm:col-span-2">
              <div className="w-8 h-8 rounded-full bg-purple-700 border border-purple-400 flex items-center justify-center text-sm shrink-0">
                👑
              </div>
              <div>
                <div className="font-bold text-purple-300">怪盜首領·男爵 (Baron Squeak)</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  怪盜松鼠旅團首領！身披深紫燕尾披風、戴羽飾魔術大禮帽與紳士白鬍鬚，手持「三元魔導杖」發射雷火冰魔法！
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
