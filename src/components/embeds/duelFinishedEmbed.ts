import type { EmbedOptions } from "oceanic.js";
import type { Duel } from "../../types/duel.ts";

export function duelFinishedEmbed(duel: Duel): EmbedOptions {
    const challengerScore = duel.challenger.score!;
    const opponentScore = duel.opponent.score!;

    let winnerText: string;

    if (challengerScore > opponentScore) {
        winnerText =`<@${duel.challenger.id}>`;
    } else if (opponentScore > challengerScore) {
        winnerText = `<@${duel.opponent.id}>`;
    } else {
        winnerText = "It's a tie!";
    }

    return {
        title: "Verbal Memory Duel - Finished",
        fields: [
            { 
                name: "Challenger", 
                value: `<@${duel.challenger.id}> - ${challengerScore} points`,
                inline: true 
            },
            { 
                name: "Opponent", 
                value: `<@${duel.opponent.id}> - ${opponentScore} points`,
                inline: true 
            },
            { name: "Winner", value: winnerText }
        ],
        color: 0x0099FF,
    }
}
