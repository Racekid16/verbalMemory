import type { ComponentInteraction } from "oceanic.js";

export interface ComponentHandler {
    name: string;
    execute(interaction: ComponentInteraction): Promise<void>;
};
