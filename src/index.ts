import "dotenv/config";
import { Client } from "oceanic.js";
import { loadAllCommands, getCommand } from "./utils/registerCommands.ts";
import handleTestButton from "./handlers/handleTestButton.ts";
import handleDuelButton from "./handlers/handleDuelButton.ts";

if (!process.env.TOKEN) {
    console.error("No token provided!");
    process.exit(1);
}

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

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
            const scope = interaction.data.customID.split(":")[0];

            if (scope == "test") {
                await handleTestButton(interaction);
                return;
            }

            if (scope == "duel") {
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
} catch (err) {
    console.error("Failed to connect!");
    console.error(err);
    process.exit(1);
}
