import {Bot} from "./Bot"
import { RiotAPI } from "./helpers/RiotAPI";
import {Commands} from "./helpers/Commands";

const clientId = "912782868466528317"
const botToken = "OTEyNzgyODY4NDY2NTI4MzE3.GtWoxq._sC14IG8yyOTgqayUrUNQL2eOWQdU3YvaEQ70U"

if(clientId == null) {console.log("ClientId in config file is undefined!"); process.exit();}
if(botToken == null) {console.log("BotToken in config file is undefined!"); process.exit()}

const bot = Bot.createNewClient();

Commands.setToken(botToken)
Commands.registerCommands(clientId)
Bot.ListenToEvents(bot);
Bot.ListenToCommands(bot)

setInterval(function(){RiotAPI.CompareLocalToLatest(bot)}, 60000)

Bot.startBot(bot,botToken);
