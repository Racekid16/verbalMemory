import type { ComponentInteraction } from "oceanic.js";
import { testManager } from "../managers/testManager.ts";
import { wordManager } from "../managers/wordManager.ts";
import { duelManager } from "../managers/duelManager.ts";
import { testEmbed } from "../components/testEmbed.ts";
import { testButtons } from "../components/testButtons.ts";
import type { Duel } from "../types/duel.ts";

export default async function handleTestButton(interaction: ComponentInteraction) {
    const userId = interaction.user.id;
    const test = testManager.get(userId);

    if (!test) {
        await interaction.createMessage({
            content: "This test has expired or already ended!",
            flags: 64,
        });
        return;
    }
    
    // Verify the person clicking is the one who this test is for
    const embed = interaction.message.embeds[0];
    if (embed?.author?.name !== interaction.user.username) {
        await interaction.createMessage({
            content: "You can only interact with your own test!",
            flags: 64,
        });
        return;
    }

    const buttonId = interaction.data.customID;
    
    const userAnswer = buttonId === "test_seen" ? "seen" : "new";
    const correctAnswer = test.seen.has(test.currentWord!) ? "seen" : "new";
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
        test.score++;
    } else {
        test.lives--;
    }

    test.seen.add(test.currentWord!);

    // Check if game is over
    if (test.lives <= 0) {
        const finalScore = testManager.end(userId);
        
        await interaction.editParent({
            embeds: [{
                title: "Verbal Memory Test - Game Over!",
                author: {
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                },
                fields: [
                    { name: "Final Score", value: String(finalScore) }
                ],
                color: 0xFF0000,
            }],
            components: [],
        });

        // Check if this was part of a duel
        const completedDuel = duelManager.endUser(userId, finalScore);
        
        if (completedDuel) {
            await finalizeDuel(interaction, completedDuel);
        }

        return;
    }

    const nextWord = wordManager.chooseNextWord(test.seen, test.currentWord);
    test.currentWord = nextWord;

    await interaction.editParent({
        embeds: [testEmbed(interaction.user, nextWord, test)],
        components: [testButtons],
    });
}

async function finalizeDuel(interaction: ComponentInteraction, duel: Duel) {
    try {
        const challengerScore = duel.challenger.score!;
        const opponentScore = duel.opponent.score!;

        let winner: string;
        let color: number;

        if (challengerScore > opponentScore) {
            winner = `<@${duel.challenger.id}> wins!`;
            color = 0x00FF00;
        } else if (opponentScore > challengerScore) {
            winner = `<@${duel.opponent.id}> wins!`;
            color = 0x00FF00;
        } else {
            winner = "It's a tie!";
            color = 0xFFFF00;
        }

        await interaction.client.rest.channels.editMessage(duel.channelId, duel.messageId, {
            embeds: [{
                title: "Verbal Memory Duel - Complete!",
                fields: [
                    { 
                        name: "Challenger", 
                        value: `<@${duel.challenger.id}>: **${challengerScore}** points`,
                        inline: true 
                    },
                    { 
                        name: "Opponent", 
                        value: `<@${duel.opponent.id}>: **${opponentScore}** points`,
                        inline: true 
                    },
                    { name: "Winner", value: winner }
                ],
                color,
            }],
            components: [],
        });

        // Delete threads (extract thread IDs from messageUrls)
        if (duel.challenger.messageUrl) {
            const threadId = extractThreadId(duel.challenger.messageUrl);
            if (threadId) {
                await interaction.client.rest.channels.delete(threadId).catch(() => {});
            }
        }
        if (duel.opponent.messageUrl) {
            const threadId = extractThreadId(duel.opponent.messageUrl);
            if (threadId) {
                await interaction.client.rest.channels.delete(threadId).catch(() => {});
            }
        }
    } catch (err) {
        console.error("Failed to finalize duel:", err);
    }
}

function extractThreadId(messageUrl: string): string | null {
    const match = messageUrl.match(/channels\/\d+\/(\d+)\/\d+/);
    return match ? match[1] : null;
}