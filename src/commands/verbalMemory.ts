import { type CommandInteraction, type User } from "oceanic.js";
import { gameManager } from "../managers/gameManager.ts";
import { wordManager } from "../managers/wordManager.ts";
import { verbalEmbed } from "../components/verbalEmbed.ts";
import { verbalButtons } from "../components/verbalButtons.ts";
import { dualButtons } from "../components/duelButtons.ts";

export default {
    name: "verbal memory",
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

        await startDuel(interaction, interaction.user, opponent);
    },
};

async function startSolo(interaction: CommandInteraction, user: User) {
    gameManager.startTest(user.id);

    const test = gameManager.getTest(user.id)!;
    const { word } = wordManager.chooseNextWord(test.seen, null);

    await interaction.reply({
        embeds: [verbalEmbed(user, word, test)],
        components: [verbalButtons],
    });
}

async function startDuel(
    interaction: CommandInteraction,
    challenger: User,
    opponent: User
) {
    await interaction.reply({
        content: `${opponent.mention}, do you accept ${challenger.mention}'s challenge?`,
        components: [dualButtons],
    });
}
