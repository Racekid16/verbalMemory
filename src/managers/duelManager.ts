import type { Duel } from "../types/duel.ts";

export class DuelManager {
    private duels = new Map<string, Duel>(); // key = messageId

    start(
        challengerId: string, opponentId: string,
        channelId: string, messageId: string,
        challengerMessageURL: string, opponentMessageURL: string
    ): Duel {
        const duel: Duel = {
            challenger: {
                id: challengerId,
                score: null,
                messageUrl: challengerMessageURL,
            },
            opponent: {
                id: opponentId,
                score: null,
                messageUrl: opponentMessageURL,
            },
            channelId: channelId,
            messageId: messageId,
        };

        this.duels.set(duel.messageId, duel);
        return duel;
    }

    get(userId: string): Duel | null {
        for (const duel of this.duels.values()) {
            if (duel.challenger.id === userId || duel.opponent.id === userId) {
                return duel;
            }
        }
        return null;
    }

    endUser(userId: string, score: number): Duel | null {
        const duel = this.get(userId);
        // test was not a duel
        if (!duel) return null;

        if (duel.challenger.id === userId) {
            duel.challenger.score = score;
        } else if (duel.opponent.id === userId) {
            duel.opponent.score = score;
        }

        // Both users finished - clean up and return the finished duel
        if (duel.challenger.score !== null && duel.opponent.score !== null) {
            this.duels.delete(duel.messageId);
            return duel;
        }

        // Only one user finished so far
        return null;
    }
}

// singleton pattern
export const duelManager = new DuelManager();
