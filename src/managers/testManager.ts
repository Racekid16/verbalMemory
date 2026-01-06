import type { Test } from "../types/test.ts";

export class TestManager {
    private tests: Map<string, Test> = new Map(); // key = userId

    start(userId: string, initialLives = 3): Test {
        const test: Test = {
            seen: new Set(),
            currentWord: null,
            score: 0,
            lives: initialLives,
        };

        this.tests.set(userId, test);
        return test;
    }
    
    get(userId: string): Test | null {
        return this.tests.get(userId) || null;
    }
    
    end(userId: string): number {
        const test = this.tests.get(userId);
        const score = test?.score || 0;
        this.tests.delete(userId);
        return score;
    }
}

// singleton pattern
export const testManager = new TestManager();