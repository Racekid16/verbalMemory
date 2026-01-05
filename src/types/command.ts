import type { CommandInteraction } from "oceanic.js";

export interface Command {
    name: string;
    description?: string;
    slash?: boolean;
    execute(interaction: CommandInteraction): Promise<void>;
};
