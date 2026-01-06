import type { EmbedOptions } from "oceanic.js";
import { Test } from "../../classes/test.ts";

export function testFinishedEmbed(test: Test): EmbedOptions {
    return {
        title: "Verbal Memory Test - Finished",
        author: {
            name: test.user.username,
            iconURL: test.user.avatarURL(),
        },
        fields: [
            { name: "Score", value: String(test.score) }
        ],
        color: 0x0099FF, 
    };
}
