import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Client } from "oceanic.js";
import type { ComponentHandler } from "../classes/componentHandler.ts";

const basePath = dirname(fileURLToPath(import.meta.url));
const cmdPath = resolve(basePath, "../componentHandlers");

// Store loaded component handlers 
const componentHandlers = new Map<string, ComponentHandler>(); // key = component name

// Load a single component handler file
export async function loadComponentHandler(componentHandlerPath: string) {
    // console.log(`Loading component handler from ${componentHandlerPath}...`);

    try {
        const { default: componentHandler } = await import(componentHandlerPath);

        if (!componentHandler || !componentHandler.name) {
            console.warn(`Component handler at ${componentHandlerPath} is missing name, skipping...`);
            return;
        }

        componentHandlers.set(componentHandler.name, componentHandler);
        // console.log(`Loaded componentHandler: ${componentHandler.name}`);

    } catch (err) {
        console.error(`Failed to load component handler at ${componentHandlerPath}:`, err);
    }
}

// Load all component handlers from the component handlers directory
export async function loadAllComponentHandlers() {
    const { glob } = await import("node:fs/promises");

    // console.log("Loading component handlers...");

    // Load .js files (compiled TypeScript)
    for await (const file of glob(resolve(cmdPath, "*.js"))) {
        await loadComponentHandler(file);
    }

    console.log(`Loaded ${componentHandlers.size} component handlers`);
}

// Get a component handler by name
export function getComponentHandler(name: string) {
    return componentHandlers.get(name);
}

// Get all component handlers
export function getAllComponentHandlers() {
    return componentHandlers;
}