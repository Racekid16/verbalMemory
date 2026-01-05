import "dotenv/config";
import { readFileSync } from "node:fs";
import { Client, type CommandInteraction } from "oceanic.js";
import { loadAllCommands, getCommand } from "./handlers/registerCommands.ts";
import handleTestButton from "./handlers/handleTestButton.ts";
import handleDuelButton from "./handlers/handleDuelButton.ts";

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

client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isCommandInteraction()) {
            const command = getCommand(interaction.data.name);
            if (!command) return;

            await command.execute(interaction);
            return;
        }

        if (interaction.isComponentInteraction()) {
            const id = interaction.data.customID;

            if (id.startsWith("test_")) {
                await handleTestButton(interaction);
                return;
            }

            if (id.startsWith("duel_")) {
                await handleDuelButton(interaction);
                return;
            }
        }
    } catch (err) {
        console.error("Interaction error:", err);

        if (!interaction.acknowledged && interaction.isCommandInteraction()) {
            await interaction.reply({
                content: "An error occurred!",
                flags: 64,
            });
        }
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
