import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "./Types";
import { prisma } from "../../db/db";
import { z } from "zod";
import { updateWhitelistNames } from "../utils/updateWhitelistNames";

export const wlList: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("wl-list")
    .setDescription("View the current whitelist"),
  handler: async ({ client, interaction }) => {
    const users = await prisma.user.findMany({});

    await updateWhitelistNames();

    await interaction.deferReply();

    const userNameArray: string[] = users.map(
      (item) =>
        `\`\`\`${item.lastUsername?.toString() || item.uuid + " (no username on file)"}\`\`\``,
    );

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
