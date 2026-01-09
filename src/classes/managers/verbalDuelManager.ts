import { VerbalDuel } from "../verbalDuel.ts";
import { VerbalTest } from "../verbalTest.ts";

export class VerbalDuelManager {
    private userIdToDuelKey: Map<string, string> = new Map();  // key = userId, value = key for corresponding duel in duels
    private duels: Map<string, VerbalDuel> = new Map(); // key = messageId

    start(challengerTest: VerbalTest, opponentTest: VerbalTest): VerbalDuel {
        const duel = new VerbalDuel(challengerTest, opponentTest);
        const challengerId = challengerTest.user.id;
        const opponentId = opponentTest.user.id;
        const duelKey: string = `${challengerId}|${opponentId}`;
        this.duels.set(duelKey, duel);
        this.userIdToDuelKey.set(challengerId, duelKey);
        this.userIdToDuelKey.set(opponentId, duelKey);
        return duel;
    }

    get(userId: string): VerbalDuel | null {
        const duelKey = this.userIdToDuelKey.get(userId);
        if (!duelKey) return null;
        return this.duels.get(duelKey) || null;
    }

    end(userId: string) {
        const duel = this.get(userId);
        if (!duel) return;
        if (duel.challenger.lives <= 0 && duel.opponent.lives <= 0) {
            const challengerId = duel.challenger.user.id;
            const opponentId = duel.opponent.user.id;
            this.userIdToDuelKey.delete(challengerId);
            this.userIdToDuelKey.delete(opponentId);
            const duelKey: string = `${challengerId}|${opponentId}`;
            this.duels.delete(duelKey);
        }
    }
}

// singleton pattern
export const verbalDuelManager = new VerbalDuelManager();
