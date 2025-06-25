import { BitField, Client, IntentsBitField, InteractionType } from "discord.js";
import { menus } from "./contextMenus";
import { slashCommands } from "./commands";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isMessageContextMenuCommand()) {
    console.log(interaction.commandName);
    menus[interaction.commandName].handler({
      interaction,
      client,
    });
  } else if (interaction.isChatInputCommand()) {
    slashCommands[interaction.commandName].handler({
      client,
      interaction,
    });
  }
});

client.login(process.env.token);
console.log("Live!");
