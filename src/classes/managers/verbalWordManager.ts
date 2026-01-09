import { readFileSync } from "node:fs";

const MAX_P = 0.7;
const SCALE = 15 / MAX_P;

export class VerbalWordManager {
    private words: string[];
    
    constructor(wordsFilePath: string) {
        this.words = readFileSync(wordsFilePath, "utf-8").split("\n");
    }
    
    chooseNextWord(seen: Set<string>, currentWord: string | null): string {
        const seenCount = seen.size;
        
        // First word is always new
        if (seenCount === 0) {
            const word = this.getRandomUnseen(seen);
            return word;
        }
        
        const pSeen = Math.min(MAX_P, seenCount / SCALE);
        let word: string;
        let isNew: boolean;
        
        // Choose seen or unseen based on probability
        if (Math.random() < pSeen && seenCount > 0) {
            word = this.getRandomSeen(seen);
            isNew = false;
        } else {
            word = this.getRandomUnseen(seen);
            isNew = true;
        }
        
        // Ensure we don't show the same word twice in a row
        if (word === currentWord) {
            return this.chooseNextWord(seen, currentWord);
        }
        
        return word;
    }
    
    private getRandomUnseen(seen: Set<string>): string {
        let word: string;
        let attempts = 0;
        const maxAttempts = 1000; // Prevent infinite loop if somehow all words are seen
        
        do {
            word = this.words[Math.floor(Math.random() * this.words.length)];
            attempts++;
        } while (seen.has(word) && attempts < maxAttempts);
        
        return word;
    }
    
    private getRandomSeen(seen: Set<string>): string {
        const seenArray = Array.from(seen);
        return seenArray[Math.floor(Math.random() * seenArray.length)];
    }
}

// singleton pattern
export const verbalWordManager = new VerbalWordManager("assets/words.txt");