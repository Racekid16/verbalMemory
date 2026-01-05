import type { Duel } from "../types/duel.ts";

class DuelManager {
    private duels = new Map<string, Duel>(); // key = messageId

    create(duel: Duel) {
        this.duels.set(duel.messageId, duel);
    }

    get(messageId: string) {
        return this.duels.get(messageId);
    }

    finishUser(messageId: string, userId: string, score: number): Duel | null {
        const duel = this.duels.get(messageId);
        if (!duel) return null;

        if (duel.challenger.id === userId) {
            duel.challenger.score = score;
        } else if (duel.opponent.id === userId) {
            duel.opponent.score = score;
        }

        if (
            duel.challenger.score !== null &&
            duel.opponent.score !== null
        ) {
            this.duels.delete(messageId);
            return duel;
        }

        return null;
    }
}

// singleton pattern
export const duelManager = new DuelManager();
