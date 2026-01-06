import { Test } from "./test.ts";

export class Duel {
    challenger: Test;
    opponent: Test;
    messageURL: string | null = null;

    constructor(challenger: Test, opponent: Test) {
        this.challenger = challenger;
        this.opponent = opponent;
    }
};
