import { readFileSync } from "node:fs";

const MAX_SEEN_P = 0.7;  // max probability that a shown word is seen
const SEEN_SCALE = 15 / MAX_SEEN_P;     // gradually increase probability; max out at 15 seen

const MAX_SIMILAR_P = 0.3;  // max probability that a new word is similar to a seen word
const SIMILAR_SCALE = 50 / MAX_SIMILAR_P;   // gradually increase probability; max out at 50 seen

export class VerbalWordManager {
    private words: string[];
    
    constructor(wordsFilePath: string) {
        this.words = readFileSync(wordsFilePath, "utf-8").split("\n");
    }
    
    chooseNextWord(seen: Set<string>, currentWord: string | null): string {
        const seenCount = seen.size;
        
        // First word is always new
        if (seenCount === 0) {
            const word = this.getRandomNew(seen);
            return word;
        }
        
        const pSeen = Math.min(MAX_SEEN_P, seenCount / SEEN_SCALE);
        let word: string;
        
        // Choose seen or new based on probability
        if (Math.random() < pSeen) {
            word = this.getRandomSeen(seen);
        } else {
            const pSimilar = Math.min(MAX_SIMILAR_P, seenCount / SIMILAR_SCALE);

            if (Math.random() < pSimilar) {
                word = this.getSimilarNew(seen);
            } else {
                word = this.getRandomNew(seen);
            }
        }
        
        // Ensure we don't show the same word twice in a row
        if (word === currentWord) {
            return this.chooseNextWord(seen, currentWord);
        }
        
        return word;
    }
    
    private getRandomSeen(seen: Set<string>): string {
        const seenArray = Array.from(seen);
        return seenArray[Math.floor(Math.random() * seenArray.length)];
    }

    private getRandomNew(seen: Set<string>): string {
        let word: string;
        let attempts = 0;
        const maxAttempts = 1000; // Prevent infinite loop if somehow all words are seen
        
        do {
            word = this.words[Math.floor(Math.random() * this.words.length)];
            attempts++;
        } while (seen.has(word) && attempts < maxAttempts);
        
        return word;
    }

    private getSimilarNew(seen: Set<string>): string {
        const seenArray = Array.from(seen);
        const targetWord = seenArray[Math.floor(Math.random() * seenArray.length)];
        const targetIndex = this.binarySearchIndex(targetWord);
        
        if (targetIndex === -1) {
            return this.getRandomNew(seen);
        }
        
        const pAlphabetical = 0.6;
        
        if (Math.random() < pAlphabetical) {
            return this.getSimilarByAlphabetical(seen, targetIndex);
        } else {
            return this.getSimilarByEditDistance(seen, targetWord);
        }
    }

    private getSimilarByAlphabetical(seen: Set<string>, targetIndex: number): string {
        const searchRadius = 50; // How many words away to search
        const attempts = 20;
        
        for (let i = 0; i < attempts; i++) {
            // Bias toward closer words using triangular distribution
            const offset = Math.floor((Math.random() + Math.random() - 1) * searchRadius);
            const candidateIndex = Math.max(0, Math.min(this.words.length - 1, targetIndex + offset));
            const candidate = this.words[candidateIndex];
            
            if (!seen.has(candidate)) {
                return candidate;
            }
        }
        
        return this.getRandomNew(seen);
    }
    
    private getSimilarByEditDistance(seen: Set<string>, targetWord: string): string {
        const maxDistance = 3;
        const sampleSize = 100; // Check this many random words
        let bestCandidate: string | null = null;
        let bestDistance = Infinity;
        
        for (let i = 0; i < sampleSize; i++) {
            const candidate = this.words[Math.floor(Math.random() * this.words.length)];
            
            if (seen.has(candidate)) continue;
            
            const distance = this.levenshteinDistance(targetWord, candidate);
            
            if (distance <= maxDistance && distance < bestDistance) {
                bestCandidate = candidate;
                bestDistance = distance;
                
                // If we find a very similar word, use it immediately
                if (distance === 1) break;
            }
        }
        
        // If we found a similar word, return it, otherwise fallback
        return bestCandidate || this.getRandomNew(seen);
    }
    
    // got this algorithm from chat GPT
    private levenshteinDistance(a: string, b: string): number {
        // Quick optimization: if length difference is too large, skip calculation
        if (Math.abs(a.length - b.length) > 3) return Infinity;
        
        const matrix: number[][] = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }

    private binarySearchIndex(word: string): number {
        let left = 0;
        let right = this.words.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = this.words[mid].localeCompare(word);
            
            if (comparison === 0) {
                return mid;
            } else if (comparison < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
}

// singleton pattern
export const verbalWordManager = new VerbalWordManager("assets/verbalWords.txt");