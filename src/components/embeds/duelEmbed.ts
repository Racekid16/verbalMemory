import type { EmbedOptions } from "oceanic.js";
import type { Duel } from "../../types/duel.ts";

export function duelEmbed(duel: Duel): EmbedOptions {
    return {
        title: "Verbal Memory Duel - In Progress ⌛",
        fields: [
            { 
                name: "Challenger", 
                value: `<@${duel.challenger.id}> - ${duel.challenger.messageUrl}`,
                inline: true 
            },
            { 
                name: "Opponent", 
                value: `<@${duel.opponent.id}> - ${duel.opponent.messageUrl}`,
                inline: true 
            },
        ],
        color: 0x0099FF,
    }
}
