import type { EmbedOptions } from "oceanic.js";
import { VerbalDuel } from "../../classes/verbalDuel.ts";

export function verbalDuelFinishedEmbed(duel: VerbalDuel): EmbedOptions {
    const challengerScore = duel.challenger.score;
    const opponentScore = duel.opponent.score;

    let winnerText: string;

    if (challengerScore > opponentScore) {
        winnerText =`<@${duel.challenger.user.id}>`;
    } else if (opponentScore > challengerScore) {
        winnerText = `<@${duel.opponent.user.id}>`;
    } else {    // challengerScore == opponentScore
        winnerText = "It's a tie!";
    }

    return {
        title: "Verbal Memory Duel - Finished",
        fields: [
            { 
                name: "Challenger", 
                value: `<@${duel.challenger.user.id}> - ${challengerScore} points`,
                inline: true 
            },
            { 
                name: "Opponent", 
                value: `<@${duel.opponent.user.id}> - ${opponentScore} points`,
                inline: true 
            },
            {
                name: "Winner",
                value: winnerText
            }
        ],
        color: 0x0099FF,
    }
}
