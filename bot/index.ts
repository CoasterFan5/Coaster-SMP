import { BitField, Client, IntentsBitField, InteractionType } from "discord.js";
import { menus } from "./contextMenus";
import { slashCommands } from "./commands";
import { prisma } from "../db/db";
import { z } from "zod";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

prisma.user
  .findMany({
    where: {
      lastUsername: null,
    },
  })
  .then((users) => {
    users.forEach((user) => {
      console.warn(`Updating ${user.discordId} to add a username`);
      fetch(
        `https://api.minecraftservices.com/minecraft/profile/lookup/${user.uuid}`,
      ).then((body) => {
        body.json().then((jsonObject) => {
          const zodParse = z
            .object({
              name: z.string(),
              id: z.string(),
            })
            .safeParse(jsonObject);
          if (zodParse.error) {
            console.warn("Could not update username");
            return;
          }
          prisma.user
            .update({
              data: {
                lastUsername: zodParse.data.name,
              },
              where: {
                uuid: user.uuid,
              },
            })
            .then(() => {
              console.log(`User Updated`);
            });
        });
      });
    });
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
