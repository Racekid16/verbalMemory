import "dotenv/config";
import { Client, type CommandInteraction } from "oceanic.js";
import { loadAllCommands, getCommand } from "./handlers/commandHandler.ts";

if (!process.env.TOKEN) {
    console.error("No token provided!");
    process.exit(1);
}

const client = new Client({
    auth: `Bot ${process.env.TOKEN}`
});

client.on("ready", async () => {
    if (!client.user) return;
    console.log("Ready as", client.user.tag);

    await loadAllCommands(client);
});

// Handle slash command interactions
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommandInteraction()) return;

    const command = getCommand(interaction.data.name);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(`Error executing command ${interaction.data.name}:`, err);
        await interaction.reply({ content: "An error occurred!", flags: 64 });
    }
});

client.on("error", (err: string | Error) => {
    console.error("Something broke!", err);
});

try {
    await client.connect();
} catch (e) {
    console.error("Failed to connect!");
    console.error(e);
    process.exit(1);
}
