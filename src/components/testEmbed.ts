import type { EmbedOptions, User } from "oceanic.js";
import type { Test } from "../types/test.ts";

export function testEmbed(
    user: User,
    word: string,
    test: Test
): EmbedOptions {
    return {
        title: "Verbal Memory Test",
        author: {
            name: user.username,
            iconURL: user.avatarURL(),
        },
        fields: [
            { name: "Word", value: `**${word}**` },
            { name: "Score", value: String(test.score), inline: true },
            {
                name: "Lives",
                value: "❤️".repeat(test.lives),
                inline: true,
            },
        ],
    };
}
