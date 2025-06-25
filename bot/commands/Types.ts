import type {
	ChatInputCommandInteraction,
	Client,
	SlashCommandBuilder,
} from "discord.js";

export type SlashCommand = {
	command: SlashCommandBuilder;
	handler: (parms: {
		client: Client<boolean>;
		interaction: ChatInputCommandInteraction;
	}) => Promise<unknown>;
};
