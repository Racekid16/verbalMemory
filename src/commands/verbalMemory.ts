import type { User, CommandInteraction } from "oceanic.js";
import { testManager } from "../classes/managers/testManager.ts";
import { testEmbed } from "../components/embeds/testEmbed.ts";
import { testButtons } from "../components/buttons/testButtons.ts";
import { duelButtons } from "../components/buttons/duelButtons.ts";

export default {
    name: "verbal-memory",
    description: "Start a verbal memory test",
    slash: true,
    options: [
        {
            type: 6, // USER
            name: "user",
            description: "Challenge another user",
            required: false,
        },
    ],

    async execute(interaction: CommandInteraction) {
        if (testManager.get(interaction.user.id)) {
            await interaction.createMessage({
                content: "You already have an ongoing test!",
                flags: 64,
            });
            return;
        }

        const opponent = interaction.data.options?.getUser("user");

        if (!opponent) {
            await startSolo(interaction, interaction.user);
            return;
        }

        if (opponent.id === interaction.user.id) {
            await interaction.createMessage({
                content: "You cannot challenge yourself!",
                flags: 64,
            });
            return;
        }

        if (testManager.get(opponent.id)) {
            await interaction.createMessage({
                content: "The challenged user already has an ongoing test!",
                flags: 64,
            });
            return;
        }

        await startDuel(interaction, interaction.user, opponent);
    },
};

async function startSolo(interaction: CommandInteraction, user: User) {
    const test = testManager.start(user);

    const res = await interaction.reply({
        embeds: [testEmbed(test)],
        components: [testButtons(test.user.id)],
    });

    const message = await res.getMessage();
    test.messageURL = `https://discord.com/channels/${message.guildID ?? "@me"}/${message?.channel?.id}/${message.id}`;
}

async function startDuel(interaction: CommandInteraction, challenger: User, opponent: User) {
    await interaction.reply({
        content: `${opponent.mention}, do you accept ${challenger.mention}'s challenge?`,
        components: [duelButtons(challenger.id, opponent.id)],
    });

    setTimeout(async () => {
        const message = await interaction.getOriginal();
        
        if (message.components && message.components.length > 0) {
            await interaction.editOriginal({
                content: `${opponent.mention} ignored the challenge 💀`,
                components: [],
            });
        }
    }, 60000);
}
