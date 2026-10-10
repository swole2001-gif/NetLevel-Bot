import { config as dotenvConfig } from 'dotenv'
import { ExtendedClient } from './class/ExtendedClient';
import { config } from './config';

dotenvConfig();

export const client: ExtendedClient = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.on("ready", async () => {
    console.log(`${client.user?.tag} has logged into Discord!`);
    try {
        console.log("Forcing slash command registration...");
        // This fixed line maps the command data layout correctly
        await client.application?.commands.set(client.commands.map((cmd: any) => cmd.data));
        console.log("Successfully forced slash commands to Discord!");
    } catch (error) {
        console.error("Failed to force commands:", error);
    }
});
