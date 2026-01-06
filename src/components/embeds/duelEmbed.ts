import type { EmbedOptions } from "oceanic.js";
import type { Duel } from "../../classes/duel.ts";

export function duelEmbed(duel: Duel): EmbedOptions {
    return {
        title: "Verbal Memory Duel - In Progress ⌛",
        fields: [
            { 
                name: "Challenger", 
                value: `<@${duel.challenger.user.id}> - ${duel.challenger.messageURL}`,
                inline: true 
            },
            { 
                name: "Opponent", 
                value: `<@${duel.opponent.user.id}> - ${duel.opponent.messageURL}`,
                inline: true 
            },
        ],
        color: 0x0099FF,
    }
}
