import type { CommandInteraction, ApplicationCommandOptions } from "oceanic.js";

export interface Command {
    name: string;
    description?: string;
    slash?: boolean;
    options?: ApplicationCommandOptions[];
    execute(interaction: CommandInteraction): Promise<void>;
};
