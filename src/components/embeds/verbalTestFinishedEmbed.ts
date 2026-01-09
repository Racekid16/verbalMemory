import type { EmbedOptions } from "oceanic.js";
import { VerbalTest } from "../../classes/verbalTest.ts";

export function verbalTestFinishedEmbed(test: VerbalTest): EmbedOptions {
    return {
        title: "Verbal Memory Test - Finished",
        author: {
            name: test.user.username,
            iconURL: test.user.avatarURL(),
        },
        fields: [
            {
                name: "Score",
                value: String(test.score)
            }
        ],
        color: 0x0099FF, 
    };
}
