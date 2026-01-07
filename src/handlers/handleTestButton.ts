import type { Client, ComponentInteraction } from "oceanic.js";
import { testManager } from "../classes/managers/testManager.ts";
import { duelManager } from "../classes/managers/duelManager.ts";
import { testEmbed } from "../components/embeds/testEmbed.ts";
import { duelFinishedEmbed } from "../components/embeds/duelFinishedEmbed.ts";
import { testFinishedEmbed } from "../components/embeds/testFinishedEmbed.ts";
import { testButtons } from "../components/buttons/testButtons.ts";
import type { Duel } from "../classes/duel.ts";
import type { Test } from "../classes/test.ts";

export default async function handleTestButton(interaction: ComponentInteraction) {
    const [scope, action, userId] = interaction.data.customID.split(":");

    if (interaction.user.id !== userId) {
        await interaction.createMessage({
            content: "This is not your test!",
            flags: 64,
        });
        return;
    }

    const test = testManager.get(userId);
    if (!test) {
        await interaction.createMessage({
            content: "This test has expired or already ended.",
            flags: 64,
        });
        return;
    }

    await interaction.deferUpdate();

    test.clearTimeouts();
    test.submitAnswer(action);

    if (test.lives <= 0) {
        await interaction.editOriginal({
            embeds: [testFinishedEmbed(test)],
            components: [],
        });

        const duel = duelManager.get(userId);
        if (duel) {
            if (duel.challenger.lives <= 0 && duel.opponent.lives <= 0) {
                await endDuel(interaction.client, duel);
            }
        } else {
            await endSolo(test);
        }

    } else {    // livesRemaining > 0
        await interaction.editOriginal({
            embeds: [testEmbed(test)],
            components: [testButtons(test.user.id)],
        });

        const message = interaction.message;
        startTestTimeout(test, interaction.client, message.channelID, message.id);
    }
}

// Start timeout tracking for a test
export function startTestTimeout(test: Test, client: Client, channelId: string, messageId: string) {
    test.clearTimeouts();
    let warningStartTime: number;

    const warningTimeout = setTimeout(async () => {
        warningStartTime = Date.now();
    }, 20000);

    const countdownInterval = setInterval(async () => {
        if (!test.warningTimeout) {
            clearInterval(countdownInterval);
            return;
        }

        const elapsed = Date.now() - warningStartTime;
        const remaining = Math.max(1, Math.ceil(10 - elapsed / 1000));
        const displayTime = remaining - 1;
        
        if (remaining <= 10) {
            await updateTestWithWarning(test, client, channelId, messageId, displayTime);
        }
    }, 1000);

    const mainTimeout = setTimeout(async () => {
        clearInterval(countdownInterval);
        await handleTestTimeout(test, client, channelId, messageId);
    }, 30000);

    test.warningTimeout = warningTimeout;
    test.mainTimeout = mainTimeout;
    test.countdownInterval = countdownInterval;
}

// Update test embed with warning footer
async function updateTestWithWarning(test: Test, client: Client, channelId: string, messageId: string, secondsRemaining: number) {
    const embed = testEmbed(test);
    embed.footer = { text: `⏰ ${secondsRemaining} seconds remaining!` };
    
    await client.rest.channels.editMessage(channelId, messageId, {
        embeds: [embed],
        components: [testButtons(test.user.id)],
    });
}

// Handle test timeout (30 seconds elapsed)
async function handleTestTimeout(test: Test, client: Client, channelId: string, messageId: string) {
    test.clearTimeouts();
    // Submit wrong answer to lose a life and move to next word
    test.submitAnswer("wrong");

    if (test.lives <= 0) {
        await client.rest.channels.editMessage(channelId, messageId, {
            embeds: [testFinishedEmbed(test)],
            components: [],
        });

        const duel = duelManager.get(test.user.id);
        if (duel) {
            if (duel.challenger.lives <= 0 && duel.opponent.lives <= 0) {
                await endDuel(client, duel);
            }
        } else {
            await endSolo(test);
        }
    } else {
        await client.rest.channels.editMessage(channelId, messageId, {
            embeds: [testEmbed(test)],
            components: [testButtons(test.user.id)],
        });

        startTestTimeout(test, client, channelId, messageId);
    }
}

async function endSolo(test: Test) {
    testManager.end(test.user.id);
}

async function endDuel(client: Client, duel: Duel) {
    const parts = duel?.messageURL?.split("/");
    if (!parts) throw new Error();
    const channelId = parts[parts.length - 2];
    const messageId = parts[parts.length - 1];

    await client.rest.channels.editMessage(channelId, messageId, {
        embeds: [duelFinishedEmbed(duel)],
        components: [],
    });

    if (duel.challenger.messageURL) {
        const threadId = extractThreadId(duel.challenger.messageURL);
        if (!threadId) throw new Error();
        await client.rest.channels.delete(threadId);
    }

    if (duel.opponent.messageURL) {
        const threadId = extractThreadId(duel.opponent.messageURL);
        if (!threadId) throw new Error();
        await client.rest.channels.delete(threadId);
    }

    duelManager.end(duel.challenger.user.id);
    testManager.end(duel.challenger.user.id);
    testManager.end(duel.opponent.user.id);
}

function extractThreadId(messageURL: string): string | null {
    const match = messageURL.match(/channels\/\d+\/(\d+)\/\d+/);
    return match ? match[1] : null;
}