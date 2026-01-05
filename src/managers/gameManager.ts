import type { Test } from "../types/test.ts";

export class GameManager {
    private ongoingTests: Map<string, Test> = new Map();

    startTest(userId: string, initialLives = 3) {
        this.ongoingTests.set(userId, {
            seen: new Set(),
            previousWord: null,
            score: 0,
            lives: initialLives,
        });
    }
    
    getTest(userId: string) {
        return this.ongoingTests.get(userId);
    }
    
    updateTest(userId: string, updates: Partial<Test>) {
        const test = this.ongoingTests.get(userId);
        if (!test) return;
        Object.assign(test, updates);
    }
    
    endTest(userId: string): number {
        const test = this.ongoingTests.get(userId);
        const score = test?.score || 0;
        this.ongoingTests.delete(userId);
        return score;
    }
    
    hasOngoingTest(userId: string) {
        return this.ongoingTests.has(userId);
    }

}

// singleton pattern
export const gameManager = new GameManager();