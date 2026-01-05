export interface Test {
    seen: Set<string>;
    currentWord: string | null;
    score: number;
    lives: number;
};
