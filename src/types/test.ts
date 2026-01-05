export interface Test {
    seen: Set<string>;
    previousWord: string | null;
    score: number;
    lives: number;
};
