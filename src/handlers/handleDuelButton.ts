import type { ComponentInteraction, TextableChannel } from "oceanic.js";
import { duelManager } from "../classes/managers/duelManager.ts";
import { testManager } from "../classes/managers/testManager.ts";
import { startTestTimeout } from "./handleTestButton.ts";
import { testEmbed } from "../components/embeds/testEmbed.ts";
import { duelEmbed } from "../components/embeds/duelEmbed.ts";
import { testButtons } from "../components/buttons/testButtons.ts";

export default async function handleDuelButton(interaction: ComponentInteraction) {
    const [scope, action, challengerId, opponentId] = interaction.data.customID.split(":");

    if (interaction.user.id !== opponentId) {
        await interaction.createMessage({
            content: "You are not the challenged user!",
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

    await interaction.deferUpdate();
    
    if (action === "accept") {
        await acceptDuel(interaction);
    } else if (action === "decline") {
        await declineDuel(interaction);
    }
}

async function acceptDuel(interaction: ComponentInteraction) {
    const [scope, action, challengerId, opponentId] = interaction.data.customID.split(":");
    
    const challenger = await interaction.client.rest.users.get(challengerId);
    const opponent = interaction.user;

    // Create threads
    let challengerThread;
    try {
        challengerThread = await interaction.client.rest.channels.startThreadWithoutMessage(
            interaction.channelID,
            {
                name: `${challenger.username}'s Verbal Memory Test`,
                autoArchiveDuration: 60,
                type: 11, // PUBLIC_THREAD
            }
        );
    } catch (err) {
        await interaction.reply({
            content: "I don't have the necessary permissions to run duels 😭\nPlease ensure I have: Send Messages, Create Public Threads, Send Messages in Threads, and Manage Threads.",
            flags: 64,
        });
        return;
    }

    const opponentThread = await interaction.client.rest.channels.startThreadWithoutMessage(
        interaction.channelID,
        {
            name: `${opponent.username}'s Verbal Memory Test`,
            autoArchiveDuration: 60,
            type: 11, // PUBLIC_THREAD
        }
    );

    const challengerTest = testManager.start(challenger);
    const opponentTest = testManager.start(opponent);

    const challengerMessage = await interaction.client.rest.channels.createMessage(
        challengerThread.id,
        {
            content: `<@${challengerTest.user.id}>`,
            embeds: [testEmbed(challengerTest)],
            components: [testButtons(challengerTest.user.id)],
        }
    );
    challengerTest.messageURL = `https://discord.com/channels/${challengerMessage.guildID ?? "@me"}/${challengerMessage?.channel?.id}/${challengerMessage.id}`;
    startTestTimeout(challengerTest, interaction);

    const opponentMessage = await interaction.client.rest.channels.createMessage(
        opponentThread.id,
        {
            content: `<@${opponentTest.user.id}>`,
            embeds: [testEmbed(opponentTest)],
            components: [testButtons(opponentTest.user.id)],
        }
    );
    opponentTest.messageURL = `https://discord.com/channels/${opponentMessage.guildID ?? "@me"}/${opponentMessage?.channel?.id}/${opponentMessage.id}`; 
    startTestTimeout(opponentTest, interaction);

    const duel = duelManager.start(challengerTest, opponentTest);

    await interaction.editOriginal({
        content: "",
        embeds: [duelEmbed(duel)],
        components: [],
    });

    const message = await interaction.getOriginal();
    duel.messageURL = `https://discord.com/channels/${message.guildID ?? "@me"}/${message.channelID}/${message.id}`;
}

async function declineDuel(interaction: ComponentInteraction) {
    await interaction.editOriginal({
        content: `${interaction.user.mention} declined the challenge.`,
        components: [],
    });
}