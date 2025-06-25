import type {
	Client,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
} from "discord.js";

export type ContextMenuCommand = {
	command: ContextMenuCommandBuilder;
	handler: (parms: {
		client: Client<boolean>;
		interaction: ContextMenuCommandInteraction;
	}) => Promise<unknown>;
};
