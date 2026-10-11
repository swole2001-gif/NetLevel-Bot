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
        
        // This fixed line guarantees it finds the commands folder directly in your source code files
        const commandsPath = path.resolve(__dirname, 'commands');
        const commandDataList: any[] = [];

        if (fs.existsSync(commandsPath)) {
            const commandFolders = fs.readdirSync(commandsPath);
            for (const folder of commandFolders) {
                const folderPath = path.join(commandsPath, folder);
                if (fs.lstatSync(folderPath).isDirectory()) {
                    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
                    for (const file of commandFiles) {
                        const filePath = path.join(folderPath, file);
                        const command = require(filePath);
                        
                        // Handle both standard exports and default export structures safely
                        const cmdData = command?.data || command?.default?.data;
                        if (cmdData) {
                            commandDataList.push(cmdData);
                        }
                    }
                }
            }

            console.log(`Found ${commandDataList.length} total commands inside subfolders. Pushing to Discord...`);
            await client.application?.commands.set(commandDataList);
            console.log("Successfully forced all subfolder slash commands to Discord!");
        } else {
            console.error(`Error: Could not locate commands directory at path: ${commandsPath}`);
        }
    } catch (error) {
        console.error("Failed to deep-scan and force commands:", error);
    }
});
