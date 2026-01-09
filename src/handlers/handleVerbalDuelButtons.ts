import type { ComponentInteraction } from "oceanic.js";
import { verbalDuelManager } from "../classes/managers/verbalDuelManager.ts";
import { verbalTestManager } from "../classes/managers/verbalTestManager.ts";
import { startVerbalTestTimeout } from "./handleVerbalTestButtons.ts";
import { verbalTestEmbed } from "../components/embeds/verbalTestEmbed.ts";
import { verbalDuelEmbed } from "../components/embeds/verbalDuelEmbed.ts";
import { verbalTestButtons } from "../components/buttons/verbalTestButtons.ts";

export default async function handleVerbalDuelButton(interaction: ComponentInteraction) {
    const [scope, action, challengerId, opponentId] = interaction.data.customID.split(":");

    if (interaction.user.id !== opponentId) {
        await interaction.createMessage({
            content: "You are not the challenged user!",
            flags: 64,
        });
        return;
    }

    if (verbalTestManager.get(challengerId) || verbalTestManager.get(opponentId)) {
        await interaction.createMessage({
            content: "One of the users already has an ongoing test!",
            flags: 64,
        });
        return;
    }

    await interaction.deferUpdate();
    
    if (action === "accept") {
        await acceptVerbalDuel(interaction);
    } else if (action === "decline") {
        await declineVerbalDuel(interaction);
    }
}

async function acceptVerbalDuel(interaction: ComponentInteraction) {
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

    const challengerTest = verbalTestManager.start(challenger);
    const opponentTest = verbalTestManager.start(opponent);

    const challengerMessage = await interaction.client.rest.channels.createMessage(
        challengerThread.id,
        {
            content: `<@${challengerTest.user.id}>`,
            embeds: [verbalTestEmbed(challengerTest)],
            components: [verbalTestButtons(challengerTest.user.id)],
        }
    );
    challengerTest.messageURL = `https://discord.com/channels/${challengerMessage.guildID ?? "@me"}/${challengerMessage?.channel?.id}/${challengerMessage.id}`;
    startVerbalTestTimeout(challengerTest, interaction);

    const opponentMessage = await interaction.client.rest.channels.createMessage(
        opponentThread.id,
        {
            content: `<@${opponentTest.user.id}>`,
            embeds: [verbalTestEmbed(opponentTest)],
            components: [verbalTestButtons(opponentTest.user.id)],
        }
    );
    opponentTest.messageURL = `https://discord.com/channels/${opponentMessage.guildID ?? "@me"}/${opponentMessage?.channel?.id}/${opponentMessage.id}`; 
    startVerbalTestTimeout(opponentTest, interaction);

    const duel = verbalDuelManager.start(challengerTest, opponentTest);

    await interaction.editOriginal({
        content: "",
        embeds: [verbalDuelEmbed(duel)],
        components: [],
    });

    const message = await interaction.getOriginal();
    duel.messageURL = `https://discord.com/channels/${message.guildID ?? "@me"}/${message.channelID}/${message.id}`;
}

async function declineVerbalDuel(interaction: ComponentInteraction) {
    await interaction.editOriginal({
        content: `${interaction.user.mention} declined the challenge.`,
        components: [],
    });
}