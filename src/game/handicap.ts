import type { Ball, Player } from './types';

export interface ApplyHandicapResult {
  balls: Ball[];
  updatedPlayers: Player[];
  groupsAssigned: boolean;
  handicapAppliedIds: number[];
  humanGroup: 'solid' | 'stripe';
}

export function applyHandicap(
  balls: Ball[],
  players: Player[],
  handicapBalls: number,
): ApplyHandicapResult {
  const result = Math.random() < 0.5;
  const humanGroup: 'solid' | 'stripe' = result ? 'solid' : 'stripe';
  const aiGroup: 'solid' | 'stripe' = humanGroup === 'solid' ? 'stripe' : 'solid';

  const updatedPlayers = players.map((p) => {
    if (!p.isAI) return { ...p, group: humanGroup };
    return { ...p, group: aiGroup };
  });

  const humanPlayer = updatedPlayers.find((p) => !p.isAI)!;
  const groupIds = humanGroup === 'solid' ? [1, 2, 3, 4, 5, 6, 7] : [9, 10, 11, 12, 13, 14, 15];

  const shuffled = [...groupIds].sort(() => Math.random() - 0.5);
  const toRemoveIds = shuffled.slice(0, Math.min(handicapBalls, shuffled.length));

  const updatedBalls = balls.map((b) => {
    if (toRemoveIds.includes(b.id)) {
      return { ...b, pocketed: true, pocketedAt: Date.now() };
    }
    return b;
  });

  return {
    balls: updatedBalls,
    updatedPlayers,
    groupsAssigned: true,
    handicapAppliedIds: toRemoveIds,
    humanGroup,
  };
}

export function getHandicapGroupLabel(group: 'solid' | 'stripe'): string {
  return group === 'solid' ? '全色球' : '半色球';
}
