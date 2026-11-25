import { state, save } from './state.js';
import { KITCHEN } from './kitchen-art.js';

export const RARITY = {
  common: { name: 'Common', color: '#7fd8be', odds: 52, rank: 0 },
  rare: { name: 'Rare', color: '#6fb6ff', odds: 28, rank: 1 },
  super: { name: 'Super Rare', color: '#b48cff', odds: 13, rank: 2 },
  ultra: { name: 'Ultra Rare', color: '#ffbf2e', odds: 5.5, rank: 3 },
  secret: { name: 'SECRET', color: '#ff6f9c', odds: 1.5, rank: 4 },
};

export const MINIS = [
  { id: 'cupcake', name: 'Strawberry Cupcake', r: 'common' },
  { id: 'donut', name: 'Sprinkle Donut', r: 'common' },
  { id: 'croissant', name: 'Butter Croissant', r: 'common' },
  { id: 'macaron', name: 'Lilac Macaron', r: 'common' },
  { id: 'cookie', name: 'Choco Chip Cookie', r: 'common' },
  { id: 'pancakes', name: 'Fluffy Pancakes', r: 'common' },
  { id: 'sushi', name: 'Salmon Sushi', r: 'common' },
  { id: 'boba', name: 'Brown Sugar Boba', r: 'common' },
  { id: 'bread', name: 'Cozy Bread Loaf', r: 'common' },
  { id: 'onigiri', name: 'Rice Ball Buddy', r: 'common' },
  { id: 'shortcake', name: 'Strawberry Shortcake', r: 'rare' },
  { id: 'ramen', name: 'Steamy Ramen', r: 'rare' },
  { id: 'pie', name: 'Cherry Lattice Pie', r: 'rare' },
  { id: 'dumplings', name: 'Dumpling Trio', r: 'rare' },
  { id: 'pizza', name: 'Pepperoni Slice', r: 'rare' },
  { id: 'layercake', name: 'Rainbow Birthday Cake', r: 'super' },
  { id: 'tart', name: 'Jewel Fruit Tart', r: 'super' },
  { id: 'pudding', name: 'Caramel Pudding', r: 'super' },
  { id: 'waffle', name: 'Golden Waffle', r: 'ultra' },
  { id: 'icecream', name: 'Quadruple Scoop', r: 'ultra' },
  { id: 'teacup', name: 'Teacup Mochi', r: 'secret' },
];
export const M = Object.fromEntries(MINIS.map(m => [m.id, m]));
export const BOX_PRICE = 80;
export const DUP_REFUND = 25;

export function rollMini() {
  state.pity = (state.pity || 0) + 1;
  let tiers = Object.entries(RARITY);
  if (state.pity >= 8) tiers = tiers.filter(([, v]) => v.rank >= 2); // pity: guaranteed super rare or better
  const total = tiers.reduce((a, [, v]) => a + v.odds, 0);
  let r = Math.random() * total, tier = tiers[0][0];
  for (const [k, v] of tiers) { r -= v.odds; if (r <= 0) { tier = k; break; } }
  if (RARITY[tier].rank >= 2) state.pity = 0;
  const pool = MINIS.filter(m => m.r === tier);
  const unowned = pool.filter(m => !state.minis[m.id]);
  const m = (unowned.length && Math.random() < 0.7) ? unowned[Math.floor(Math.random() * unowned.length)] : pool[Math.floor(Math.random() * pool.length)];
  const isNew = !state.minis[m.id];
  state.minis[m.id] = (state.minis[m.id] || 0) + 1;
  state.stats.boxes++;
  if (!isNew) state.coins += DUP_REFUND;
  save();
  return { mini: m, isNew };
}

// Rarest minis first, to show off on the kitchen shelf
export function shelfMinis() {
  const n = KITCHEN.shelf.items[state.decor.shelf]?.slots || 3;
  return MINIS.filter(m => state.minis[m.id]).sort((a, b) => RARITY[b.r].rank - RARITY[a.r].rank).slice(0, n).map(m => m.id);
}
