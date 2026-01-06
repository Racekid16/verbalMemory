import { type CommandInteraction, type User } from "oceanic.js";
import { testManager } from "../managers/testManager.ts";
import { wordManager } from "../managers/wordManager.ts";
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
    testManager.start(user.id);

    const test = testManager.get(user.id)!;
    const firstWord = wordManager.chooseNextWord(test.seen, null);
    test.currentWord = firstWord;

    await interaction.reply({
        embeds: [testEmbed(user, test)],
        components: [testButtons],
    });
}

async function startDuel(
    interaction: CommandInteraction,
    challenger: User,
    opponent: User
) {
    await interaction.reply({
        content: `${opponent.mention}, do you accept ${challenger.mention}'s challenge?`,
        components: [duelButtons],
    });

    // Set 1 minute timeout for acceptance
    setTimeout(async () => {
        try {
            const message = await interaction.getOriginal();
            
            // Check if buttons are still present (not yet accepted/declined)
            if (message.components && message.components.length > 0) {
                await interaction.editOriginal({
                    content: `${opponent.mention} ignored the challenge 💀`,
                    components: [],
                });
            }
        } catch (err) {
            console.error("Failed to expire duel challenge:", err);
        }
    }, 60000);
}
