import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "./Types";
import { reloadWhitelist } from "../utils/reloadWhitelist";

export const wlReload: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName("wl-reload")
		.setDescription("Force reload the white list"),
	handler: async ({ client, interaction }) => {
		await interaction.deferReply();

		try {
			const reloadStatus = await reloadWhitelist();
			const newEmbed = new EmbedBuilder();
			newEmbed.setTitle("Whitelist Reloaded");
			newEmbed.setColor(Colors.Green);
			newEmbed.setDescription("The whitelist has been reloaded.");
			interaction.editReply({
				embeds: [newEmbed],
			});
			return;
		} catch (e) {
			interaction.editReply(`${e}`);
		}
	},
};
