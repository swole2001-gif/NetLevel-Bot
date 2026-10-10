import { config } from 'dotenv'
import { ExtendedClient } from './class/ExtendedClient'

config();

export const client: ExtendedClient = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.on("ready", async () => {
    try {
        console.log("Forcing slash command registration...");
        await client.application?.commands.set(client.commands.map((cmd: any) => cmd.data));
        console.log("Successfully forced slash commands to Discord!");
    } catch (error) {
        console.error("Failed to force commands:", error);
    }
});
