import type { ComponentInteraction } from "oceanic.js";
import { testManager } from "../managers/testManager.ts";
import { wordManager } from "../managers/wordManager.ts";
import { duelManager } from "../managers/duelManager.ts";
import { testEmbed } from "../components/embeds/testEmbed.ts";
import { duelFinishedEmbed } from "../components/embeds/duelFinishedEmbed.ts";
import { testFinishedEmbed } from "../components/embeds/testFinishedEmbed.ts";
import { testButtons } from "../components/buttons/testButtons.ts";
import type { Duel } from "../types/duel.ts";

export default async function handleTestButton(interaction: ComponentInteraction) {
    // Verify the person clicking is the one who this test is for
    // (comparing user IDs would be better, but oh well)
    const embed = interaction.message.embeds[0];
    if (embed?.author?.name !== interaction.user.username) {
        await interaction.createMessage({
            content: "You can only interact with your own test!",
            flags: 64,
        });
        return;
    }

    const user = interaction.user;
    const userId = user.id;
    const test = testManager.get(userId);

    if (!test) {
        await interaction.createMessage({
            content: "This test has expired or already ended!",
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
        const score = testManager.end(userId);
        
        await interaction.editParent({
            embeds: [testFinishedEmbed(user, String(score))],
            components: [],
        });

        // Check if this was part of a duel
        const finishedDuel = duelManager.endUser(userId, score);
        
        if (finishedDuel) {
            await finalizeDuel(interaction, finishedDuel);
        }

        return;
    }

    const nextWord = wordManager.chooseNextWord(test.seen, test.currentWord);
    test.currentWord = nextWord;

    await interaction.editParent({
        embeds: [testEmbed(interaction.user, test)],
        components: [testButtons],
    });
}

async function finalizeDuel(interaction: ComponentInteraction, duel: Duel) {
    try {
        await interaction.client.rest.channels.editMessage(duel.channelId, duel.messageId, {
            embeds: [duelFinishedEmbed(duel)],
            components: [],
        });

        // Delete threads (extract thread IDs from messageUrls)
        if (duel.challenger.messageUrl) {
            const threadId = extractThreadId(duel.challenger.messageUrl);
            if (threadId) {
                await interaction.client.rest.channels.delete(threadId).catch((err) => {
                    console.error("Failed to delete thread:", err);
                });
            }
        }
        if (duel.opponent.messageUrl) {
            const threadId = extractThreadId(duel.opponent.messageUrl);
            if (threadId) {
                await interaction.client.rest.channels.delete(threadId).catch((err) => {
                    console.error("Failed to delete thread:", err);
                });
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