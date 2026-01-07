import { wordManager } from "./managers/wordManager.ts";
import type { User } from "oceanic.js";

export class Test {
    user: User;
    messageURL: string | null = null;
    seenWords: Set<string> = new Set();
    currentWord: string = wordManager.chooseNextWord(this.seenWords, null);
    score: number = 0;
    lives: number = 3;
    mainTimeout: NodeJS.Timeout | null = null;
    warningTimeout: NodeJS.Timeout | null = null;
    countdownInterval: NodeJS.Timeout | null = null;

    constructor(user: User) {
        this.user = user;
    }

    submitAnswer(answer: string) {
        if (
            (this.seenWords.has(this.currentWord) && answer == "seen") ||
            (!this.seenWords.has(this.currentWord) && answer == "new")
        ) {
            this.score++;
        } else {
            this.lives--;
        }

        this.seenWords.add(this.currentWord);
        this.currentWord = wordManager.chooseNextWord(this.seenWords, this.currentWord);
    }

    clearTimeouts() {
        if (this.mainTimeout) {
            clearTimeout(this.mainTimeout);
            this.mainTimeout = null;
        }
        if (this.warningTimeout) {
            clearTimeout(this.warningTimeout);
            this.warningTimeout = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
};
