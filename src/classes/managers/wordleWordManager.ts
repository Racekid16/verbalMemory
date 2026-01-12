import { readFileSync } from "node:fs";

export class WordleWordManager {
    private words: string[];
    
    constructor(wordsFilePath: string) {
        this.words = readFileSync(wordsFilePath, "utf-8").split("\n");
    }
    
    getWord(index: number | null): string {
        if (!index) {
            return this.words[this.words.length - 1];
        }

        if (index >= 0 && index < this.words.length) {
            return this.words[index];
        }

        return "";
    }
}

// singleton pattern
export const wordleWordManager = new WordleWordManager("assets/wordleWords.txt");