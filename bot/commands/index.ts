import type { SlashCommand } from "./Types";
import { wlList } from "./wlList";
import { wlReload } from "./wlReload";

export const slashCommands: Record<string, SlashCommand> = {
  "wl-list": wlList,
  "wl-reload": wlReload,
};
