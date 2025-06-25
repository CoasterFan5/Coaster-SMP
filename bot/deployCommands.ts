import { slashCommands } from "./commands";
import { menus } from "./contextMenus";

const guildId = process.env.guild_id;

if (!guildId) {
  throw "No guild id set";
}

import { REST, Routes } from "discord.js";

const rest = new REST().setToken(process.env.token);
const items = [];

for (const key in menus) {
  items.push(menus[key].command.toJSON());
}
for (const key in slashCommands) {
  items.push(slashCommands[key].command.toJSON());
}

try {
  await rest.put(Routes.applicationGuildCommands(process.env.app_id, guildId), {
    body: items,
  });
  console.log("Deployed");
} catch (e) {
  console.error("failed to deploy commands");
}
