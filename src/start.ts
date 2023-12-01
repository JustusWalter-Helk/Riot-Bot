import {Bot} from "./Bot"
import { RiotAPI } from "./helpers/RiotAPI";
import {Commands} from "./helpers/Commands";
import * as dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.CLIENT_ID
const botToken = process.env.BOT_TOKEN

if(clientId == null) {console.log("ClientId in config file is undefined!"); process.exit();}
if(botToken == null) {console.log("BotToken in config file is undefined!"); process.exit()}

const bot = Bot.createNewClient();

Commands.setToken(botToken)
Commands.registerCommands(clientId)
Bot.ListenToEvents(bot);
Bot.ListenToCommands(bot)

setInterval(function(){RiotAPI.CompareLocalToLatest(bot)}, 60000)

Bot.startBot(bot,botToken);
