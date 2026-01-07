import type { EmbedOptions } from "oceanic.js";
import type { Test } from "../../classes/test.ts";

export function testEmbed(test: Test): EmbedOptions {
    return {
        title: "Verbal Memory Test - In Progress ⌛",
        author: {
            name: test.user.username,
            iconURL: test.user.avatarURL(),
        },
        description: `# ${test.currentWord}`,
        fields: [
            {
                name: "Score",
                value: String(test.score),
                inline: true
            },
            {
                name: "Lives",
                value: "❤️".repeat(test.lives),
                inline: true,
            },
        ],
        color: 0x0099FF,
    };
}
