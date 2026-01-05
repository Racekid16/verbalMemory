import "dotenv/config";
import { Client } from "oceanic.js";

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
