import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Constants, type Client } from "oceanic.js";
import type { Command } from "../classes/command.ts";

const basePath = dirname(fileURLToPath(import.meta.url));
const cmdPath = resolve(basePath, "../commands");

// Store loaded commands
const commands = new Map<string, Command>(); // key = command name

// Load a single command file
export async function loadCommand(commandPath: string) {
    // console.log(`Loading command from ${commandPath}...`);

    try {
        const { default: command } = await import(commandPath);

        if (!command || !command.name) {
            console.warn(`Command at ${commandPath} is missing name, skipping...`);
            return;
        }

        commands.set(command.name, command);
        // console.log(`Loaded command: ${command.name}`);

    } catch (err) {
        console.error(`Failed to load command at ${commandPath}:`, err);
    }
}

// Load all commands from the commands directory
export async function loadAndRegisterAllCommands(client: Client) {
    const { glob } = await import("node:fs/promises");

    // console.log("Loading commands...");

    // Load .js files (compiled TypeScript)
    for await (const file of glob(resolve(cmdPath, "*.js"))) {
        await loadCommand(file);
    }

    // console.log(`Loaded ${commands.size} commands`);

    const slashCommands = Array.from(commands.values())
        .filter(cmd => cmd.slash)
        .map(cmd => ({
            type: Constants.ApplicationCommandTypes.CHAT_INPUT as const,
            name: cmd.name,
            description: cmd.description || "No description provided",
            options: cmd.options || []
        }));
    
    if (slashCommands.length > 0 && client.application) {
        await client.rest.applications.bulkEditGlobalCommands(
            client.application.id,
            slashCommands
        );
        console.log(`Registered ${slashCommands.length} commands`);
    }
}

// Get a command by name
export function getCommand(name: string) {
    return commands.get(name);
}

// Get all commands
export function getAllCommands() {
    return commands;
}