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
        console.log("Deep-scanning subfolders for custom template slash commands...");
        
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
                        const commandFile = require(filePath);
                        
                        // Extract the file object layout (handles default and module exports)
                        const commandObj = commandFile?.default || commandFile;
                        
                        // Read the developer's exact 'structure' data property from your screenshot!
                        if (commandObj && commandObj.structure) {
                            commandDataList.push(commandObj.structure);
                        }
                    }
                }
            }

            console.log(`Successfully mapped ${commandDataList.length} custom commands. Syncing directly to your server...`);
            
            // Push commands cleanly to your server using the GUILD_ID variable
            if (config.guildId) {
                const guild = client.guilds.cache.get(config.guildId);
                if (guild) {
                    await guild.commands.set(commandDataList);
                    console.log(`Success! All commands pushed directly into server: ${guild.name}`);
                } else {
                    console.log("Could not find a server matching your GUILD_ID. Pushing globally instead...");
                    await client.application?.commands.set(commandDataList);
                }
            } else {
                await client.application?.commands.set(commandDataList);
                console.log("Commands pushed globally across Discord's backend network.");
            }
        }
    } catch (error) {
        console.error("Failed to deep-scan and force commands:", error);
    }
});
