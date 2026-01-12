import type { User } from "oceanic.js";
import { VerbalTest } from "../verbalTest.ts";

export class VerbalTestManager {
    private tests: Map<string, VerbalTest> = new Map(); // key = userId

    start(user: User): VerbalTest {
        const test = new VerbalTest(user);
        this.tests.set(user.id, test);
        return test;
    }
    
    get(userId: string): VerbalTest | null {
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
export const verbalTestManager = new VerbalTestManager();