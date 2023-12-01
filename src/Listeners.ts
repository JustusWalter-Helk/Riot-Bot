import { Client, Guild, GuildChannel, GuildMember, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { RiotAPI } from "./helpers/RiotAPI";
const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms))

class Listeners
{
    public static listenToAllEvents(bot:Client)
    {

        console.log("Listening to Events...")

	bot.on("message",(msg) => {
		if(msg.content == "!ping kyuubi api")
		msg.reply("Pinging https://www.kyuubi-engine.com/riot/get/latest");
	})

	bot.on("message",(msg) =>{
if(msg.content == "-r auth=ky sendAll")
RiotAPI.SendNewArticleToAllGuilds(bot);
})

        bot.once("ready", () =>{console.log("Online!"); bot.user?.setActivity({type: "PLAYING", name: "/setup"})})

        bot.on("error", (error) =>{console.log(error)})

        //Handle MessageButtons
        bot.on("interactionCreate", async interaction =>{
            if(!interaction.isButton()) return;
            try {
                

                //Create News Channel Button
            if(interaction.customId == "createNewsChannel")
            {
                await interaction.deferReply({ephemeral:true})
                delay(1000)
                if(interaction.guild?.me?.permissions.has("MANAGE_CHANNELS"))
                {
                    const name = "riot-games-news"

                    if(interaction.guild.channels.cache.find(c => c.name === name))
                    {
                        await interaction.editReply({content: "News channel already exists!"})
                    }
                    else
                    {
                    try {
                        var id = interaction.user.id;
                        if(interaction.guild.members.cache.get(id)?.permissions.has("MANAGE_CHANNELS"))
                        {
                            try {
                                {
                                    interaction.guild.channels.create("riot-games-news", {
                                        type: "GUILD_TEXT",
                                        permissionOverwrites: [
                                            {
                                                id: interaction.guild.roles.everyone,
                                                allow: ['VIEW_CHANNEL', "READ_MESSAGE_HISTORY"],
                                                deny: ["SEND_MESSAGES"]
                                            }
                                        ]
                                    })
                                }
                            } catch (error) {
                                interaction.component.style = "DANGER"
                                interaction.component.label = "Missing permissions!"

                                var embedPermissions = new MessageEmbed()
                                    .setTitle("Setting up the Bot!")
                                    .setDescription("Something went wrong! Make sure the bot has the permission to manage channels!")
                                    .setColor("#ea0027")
                                    .setTimestamp()

                                await interaction.editReply({embeds: [embedPermissions]})
                            }

                            interaction.component.style = "SUCCESS"
                            interaction.component.label = "Success"

                            var embedSuccess = new MessageEmbed()
                                .setTitle("Setting up the bot!")
                                .setDescription("Setup complete! News will arrive in the 'Riot Games News' channel!")
                                .setColor("#ea0027")
                                .setTimestamp()

                            await interaction.editReply({embeds: [embedSuccess]})
                        }
                        else
                        {
                            interaction.component.style = "DANGER"
                            interaction.component.label = "Missing permissions!"

                            var embedUserPermission = new MessageEmbed()
                            .setTitle("Setting up the bot!")
                            .setDescription("You don´t have the permission to do that!")
                            .setColor("#ea0027")
                            .setTimestamp()

                            await interaction.editReply({embeds: [embedUserPermission]})
                        }


                    } catch (error) {
                        interaction.component.style = "DANGER"
                        interaction.component.label = "Something went wrong"
                        
                        var embedPermissions = new MessageEmbed()
                                    .setTitle("Setting up the Bot!")
                                    .setDescription("Something went wrong! Make sure the bot has the permission to manage channels!")
                                    .setColor("#ea0027")
                                    .setTimestamp()

                        await interaction.editReply({embeds: [embedPermissions]})
                    }}
                }
                else
                {
                    interaction.component.style = "DANGER"
                    interaction.component.label = "Missing Permissions!"

                    var embedPermissions = new MessageEmbed()
                    .setTitle("Setting up the Bot!")
                    .setDescription("Something went Wrong! Make sure the Bot has the Permission to Manage Channels!")
                    .setColor("#ea0027")
                    .setTimestamp()
                    await interaction.editReply({embeds: [embedPermissions]})
                }
          
            }}
            catch (error) {
                console.log(error)
            }
        })
        
        //Send Instructions on Guild Join
        bot.on("guildCreate", guild =>
        {
            try{
            console.log("Bot was added to " + guild.name)

            //Default Channel to Post Instructions
            let found = 0;
            guild.channels.cache.map((channel) =>{
                if(found === 0)
                {
                    if(channel.type === "GUILD_TEXT")
                    {
                        if(guild.me == null) return
                        if(channel.permissionsFor(guild.me).has("VIEW_CHANNEL") === true)
                        {
                            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES") === true)
                            {
                                var embed = new MessageEmbed()
                                .setTitle("Setup")
                                .setDescription("To setup the Bot please use /setup")
                                .setTimestamp()
                                .setColor("#ea0027")
                                channel.send({embeds: [embed]})
                                found = 1
                            }
                        }
                    }
                }
            })
        } catch(error)
        {
            console.log(error)
        }

        })

        bot.on("guildDelete", guild => {
            console.log("Bot was removed from " + guild.name)
        })
    }

    public static listenToAllCommands(bot:Client)
    {
        bot.on("interactionCreate", async interaction =>{
            if(!interaction.isCommand()) return;

            if(interaction.commandName == "setup")
            {
                var channel = interaction.channel;

                var embed = new MessageEmbed()
                    .setTitle("Setting up the Bot!")
                    .setDescription("To setup the Bot just press the 'Create News Channel' Button under this Message! This will take care of everything you need!")
                    .setColor("#ea0027")
                    .setTimestamp()
                    

                if(channel == null) return;
                    //Create Buttons
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("createNewsChannel")
                            .setLabel("Create News Channel")
                            .setStyle("PRIMARY"),)
                    interaction.reply({embeds: [embed], components: [row], ephemeral: true})
            }
        })
    }
}

export {Listeners}