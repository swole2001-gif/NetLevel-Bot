import { config as dotenvConfig } from 'dotenv';
import { ExtendedClient } from './class/ExtendedClient';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

dotenvConfig();

export const client: ExtendedClient = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.on("ready", async () => {
    console.log(`${client.user?.tag} has logged into Discord!`);
    try {
        console.log("Deep-scanning subfolders for leveling slash commands...");
        
        const commandsPath = path.join(__dirname, 'commands');
        const commandDataList: any[] = [];

        // This loop reads folders like 'Levels', 'Utility', etc. automatically
        const commandFolders = fs.readdirSync(commandsPath);
        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (fs.lstatSync(folderPath).isDirectory()) {
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(folderPath, file);
                    const command = require(filePath);
                    if (command && (command.data || command.default?.data)) {
                        commandDataList.push(command.data || command.default.data);
                    }
                }
            }
        }

        console.log(`Found ${commandDataList.length} hidden commands. Pushing to Discord...`);
        await client.application?.commands.set(commandDataList);
        console.log("Successfully forced all subfolder slash commands to Discord!");
    } catch (error) {
        console.error("Failed to deep-scan and force commands:", error);
    }
});
