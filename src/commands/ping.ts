import type { CommandInteraction } from "oceanic.js";

export default {
    name: "ping",
    description: "Check the bot's latency",
    slash: true, // Enable as a slash command

    async execute(interaction: CommandInteraction) {
        const start = Date.now();
        await interaction.reply({ content: "Pinging..." });
        const latency = Date.now() - start;

        await interaction.editOriginal({
            content: `🏓 Pong! Latency: ${latency}ms`
        });
    }
};