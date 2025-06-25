import { BitField, Client, IntentsBitField, InteractionType } from "discord.js";
import { menus } from "./contextMenus";
import { slashCommands } from "./commands";
import { prisma } from "../db/db";
import { z } from "zod";
import { updateWhitelistNames } from "./utils/updateWhitelistNames";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

updateWhitelistNames();

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
