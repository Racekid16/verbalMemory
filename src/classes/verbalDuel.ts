import { VerbalTest } from "./verbalTest.ts";

export class VerbalDuel {
    challenger: VerbalTest;
    opponent: VerbalTest;
    messageURL: string | null = null;

    constructor(challenger: VerbalTest, opponent: VerbalTest) {
        this.challenger = challenger;
        this.opponent = opponent;
    }
};
