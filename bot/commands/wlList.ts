import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "./Types";
import { prisma } from "../../db/db";
import { z } from "zod";

export const wlList: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("wl-list")
    .setDescription("View the current whitelist"),
  handler: async ({ client, interaction }) => {
    const users = await prisma.user.findMany({});

    await interaction.deferReply();

    const userNameArray: string[] = [];
    const promiseArray = [];

    try {
      for (const user of users) {
        const p = new Promise(async (resolve, reject) => {
          const mojangReq = await fetch(
            `https://api.minecraftservices.com/minecraft/profile/lookup/${user.uuid}`,
          );

          const body = await mojangReq.json();

          const zodParse = z
            .object({
              name: z.string(),
              id: z.string(),
            })
            .safeParse(body);

          if (zodParse.error) {
            console.warn(zodParse.error);
            reject();
            return;
          }

          userNameArray.push(zodParse.data.name);
          resolve(0);
        });
        promiseArray.push(p);
      }
    } catch (e) {
      interaction.reply("Error fetchng from mojang API");
      return;
    }

    await Promise.allSettled(promiseArray);

    const embed = new EmbedBuilder()
      .setTitle("Smp Whitelist")
      .setDescription(
        `As of <t:${Math.floor(Date.now() / 1000)}:R>:\n ${userNameArray.join(",\n")}`,
      );

    embed.setColor(Colors.White);

    interaction.editReply({
      embeds: [embed],
    });
  },
};
