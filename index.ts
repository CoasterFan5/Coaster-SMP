import { BitField, Client, IntentsBitField, InteractionType } from "discord.js";
import { menus } from "./contextMenus";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

require("./api/index");

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
  }
});

client.login(process.env.token);
console.log("Live!");
