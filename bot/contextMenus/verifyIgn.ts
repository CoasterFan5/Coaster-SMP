import {
  type ContextMenuCommandType,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionsBitField,
  EmbedBuilder,
  Colors,
} from "discord.js";
import type { ContextMenuCommand } from "./Types";
import { z } from "zod";
import { prisma } from "../../db/db";
import { reloadWhitelist } from "../utils/reloadWhitelist";

export const validateIgn: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder()
    .setName("Validate IGN")
    .setType(ApplicationCommandType.Message as ContextMenuCommandType)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  handler: async ({ interaction }) => {
    if (!interaction.isMessageContextMenuCommand()) {
      return;
    }

    const ign = interaction.targetMessage.content;

    const mojangReq = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${ign}`,
    );

    const body = await mojangReq.json();

    const zodParse = z
      .object({
        name: z.string(),
        id: z.string(),
      })
      .safeParse(body);

    if (zodParse.error) {
      return interaction.reply({
        content: `<@${interaction.targetMessage.author.id}>, there was an issue parsing your IGN.`,
      });
    }

    // test if there is already a user
    const userTest = await prisma.user.findFirst({
      where: {
        uuid: zodParse.data.id,
      },
    });

    if (userTest) {
      const embed = new EmbedBuilder()
        .setTitle("Already verified")
        .setDescription("This user is already verified!")
        .setColor(Colors.Red);
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });

      return;
    }

    await prisma.user.create({
      data: {
        uuid: zodParse.data.id,
        discordId: interaction.targetMessage.author.id,
        lastUsername: zodParse.data.name,
      },
    });

    try {
      await reloadWhitelist();
    } catch (e) {
      interaction.reply({
        content: "Error reloading whitelist",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setDescription(`Welcome to the SMP ${zodParse.data.name}!`)
      .setColor("#ffffff")
      .setAuthor({
        name: `${zodParse.data.name}`,
        iconURL: `https://mc-heads.net/avatar/${zodParse.data.id}`,
      });

    interaction.targetMessage.reply({
      embeds: [embed],
    });

    interaction.reply("User Added!");
  },
};
