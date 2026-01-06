import type { ComponentInteraction } from "oceanic.js";
import { duelManager } from "../managers/duelManager.ts";
import { testManager } from "../managers/testManager.ts";
import { wordManager } from "../managers/wordManager.ts";
import { testEmbed } from "../components/embeds/testEmbed.ts";
import { duelEmbed } from "../components/embeds/duelEmbed.ts";
import { testButtons } from "../components/buttons/testButtons.ts";

export default async function handleDuelButton(interaction: ComponentInteraction) {
    const buttonId = interaction.data.customID;
    
    if (buttonId === "duel_accept") {
        await handleAccept(interaction);
    } else if (buttonId === "duel_decline") {
        await handleDecline(interaction);
    }
}

async function handleAccept(interaction: ComponentInteraction) {
    // Parse the original message to find challenger and opponent
    const content = interaction.message.content;
    const opponentMatch = content.match(/<@(\d+)>, do you accept/);
    const challengerMatch = content.match(/accept <@(\d+)>'s challenge/);
    
    if (!opponentMatch || !challengerMatch) return;

    const opponentId = opponentMatch[1];
    const challengerId = challengerMatch[1];

    // Verify the person clicking is the opponent
    if (interaction.user.id !== opponentId) {
        await interaction.createMessage({
            content: "Only the challenged user can accept this duel!",
            flags: 64,
        });
        return;
    }

    if (testManager.get(challengerId) || testManager.get(opponentId)) {
        await interaction.createMessage({
            content: "One of the users already has an ongoing test!",
            flags: 64,
        });
        return;
    }

    const channelId = interaction.channelID!;
    const messageId = interaction.message.id!;
    
    try {
        const challenger = await interaction.client.rest.users.get(challengerId);
        const opponent = interaction.user;

        // Create threads
        const challengerThread = await interaction.client.rest.channels.startThreadWithoutMessage(
            channelId,
            {
                name: `${challenger.username}'s Verbal Memory Test`,
                autoArchiveDuration: 60,
                type: 11, // PUBLIC_THREAD
            }
        );

        const opponentThread = await interaction.client.rest.channels.startThreadWithoutMessage(
            channelId,
            {
                name: `${opponent.username}'s Verbal Memory Test`,
                autoArchiveDuration: 60,
                type: 11, // PUBLIC_THREAD
            }
        );

        // Start tests for both users
        testManager.start(challengerId);
        testManager.start(opponentId);

        const challengerTest = testManager.get(challengerId)!;
        const opponentTest = testManager.get(opponentId)!;

        const challengerWord = wordManager.chooseNextWord(challengerTest.seen, null);
        const opponentWord = wordManager.chooseNextWord(opponentTest.seen, null);

        challengerTest.currentWord = challengerWord;
        opponentTest.currentWord = opponentWord;

        // Send initial messages to threads
        const challengerMessage = await interaction.client.rest.channels.createMessage(
            challengerThread.id,
            {
                content: `<@${challengerId}>`,
                embeds: [testEmbed(challenger, challengerTest)],
                components: [testButtons],
            }
        );

        const opponentMessage = await interaction.client.rest.channels.createMessage(
            opponentThread.id,
            {
                content: `<@${opponentId}>`,
                embeds: [testEmbed(opponent, opponentTest)],
                components: [testButtons],
            }
        );

        // Store duel information
        const challengerMessageURL = `https://discord.com/channels/${interaction.guildID || "@me"}/${challengerThread.id}/${challengerMessage.id}`;
        const opponentMessageURL = `https://discord.com/channels/${interaction.guildID || "@me"}/${opponentThread.id}/${opponentMessage.id}`;

        const duel = duelManager.start(
            challengerId, opponentId,
            channelId, messageId,
            challengerMessageURL, opponentMessageURL
        );

        // Update original message
        await interaction.editParent({
            content: "",
            embeds: [duelEmbed(duel)],
            components: [],
        });

    } catch (err) {
        console.error("Failed to create duel:", err);
        await interaction.createMessage({
            content: "Failed to create duel threads!",
            flags: 64,
        });
    }
}

async function handleDecline(interaction: ComponentInteraction) {
    const content = interaction.message.content;
    const opponentMatch = content.match(/<@(\d+)>, do you accept/);
    
    if (!opponentMatch) return;

    const opponentId = opponentMatch[1];

    // Verify the person clicking is the opponent
    if (interaction.user.id !== opponentId) {
        await interaction.createMessage({
            content: "Only the challenged user can decline this duel!",
            flags: 64,
        });
        return;
    }

    await interaction.editParent({
        content: `${interaction.user.mention} declined the challenge.`,
        components: [],
    });
}