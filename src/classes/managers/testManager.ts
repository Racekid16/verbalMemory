import { User } from "oceanic.js";
import { Test } from "../test.ts";

export class TestManager {
    private tests: Map<string, Test> = new Map(); // key = userId

    start(user: User): Test {
        const test = new Test(user);
        this.tests.set(user.id, test);
        return test;
    }
    
    get(userId: string): Test | null {
        return this.tests.get(userId) || null;
    }
    
    end(userId: string) {
        const test = this.tests.get(userId);
        if (!test) return;
        if (test.lives <= 0) {
            test.clearTimeouts();
            this.tests.delete(userId);
        }
    }
}

// singleton pattern
export const testManager = new TestManager();