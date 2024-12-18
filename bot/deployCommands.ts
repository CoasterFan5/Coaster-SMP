import { menus } from "./contextMenus";

const guildId = "853285321210593300";

import { REST, Routes } from "discord.js";

const rest = new REST().setToken(process.env.token);
const items = [];

for (const key in menus) {
  items.push(menus[key].command.toJSON());
}

try {
  await rest.put(Routes.applicationGuildCommands(process.env.app_id, guildId), {
    body: items,
  });
  console.log("Deployed");
} catch (e) {
  console.error("failed to deploy commands");
}
