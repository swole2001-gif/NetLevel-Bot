import { config as dotenvConfig } from 'dotenv'
import { ExtendedClient } from './class/ExtendedClient';

dotenvConfig();

export const client: ExtendedClient = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
