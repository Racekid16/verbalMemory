import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Client } from "oceanic.js";
import type { Command } from "../types/command.ts";

const basePath = dirname(fileURLToPath(import.meta.url));
// Commands are in the same dist folder as the handler
const cmdPath = resolve(basePath, "../commands");

// Store loaded commands
const commands = new Map<string, Command>();

/**
 * Load a single command file
 */
export async function loadCommand(client: Client, commandPath: string) {
    console.log(`Loading command from ${commandPath}...`);

    try {
        const { default: command } = await import(commandPath);

        if (!command || !command.name) {
            console.warn(`Command at ${commandPath} is missing name, skipping...`);
            return;
        }

        commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);

        // Register slash command if enabled
        if (command.slash && client.application) {
            await client.application.createGlobalCommand({
                type: 1, // CHAT_INPUT
                name: command.name,
                description: command.description || "No description provided",
                options: command.options || []
            });
        }
    } catch (err) {
        console.error(`Failed to load command at ${commandPath}:`, err);
    }
}

/**
 * Load all commands from the commands directory
 */
export async function loadAllCommands(client: Client) {
    const { glob } = await import("node:fs/promises");

    console.log("Loading commands...");

    // Load .js files (compiled TypeScript)
    for await (const file of glob(resolve(cmdPath, "*.js"))) {
        await loadCommand(client, file);
    }

    console.log(`Loaded ${commands.size} commands`);
}

/**
 * Get a command by name
 */
export function getCommand(name: string) {
    return commands.get(name);
}

/**
 * Get all commands
 */
export function getAllCommands() {
    return commands;
}