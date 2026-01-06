import type { EmbedOptions, User } from "oceanic.js";

export function testFinishedEmbed(user: User, score: string): EmbedOptions {
    return {
        title: "Verbal Memory Test - Finished",
        author: {
            name: user.username,
            iconURL: user.avatarURL(),
        },
        fields: [
            { name: "Score", value: score }
        ],
        color: 0x0099FF, 
    };
}
