import type { ContextMenuCommand } from "./Types";
import { validateIgn } from "./verifyIgn";

export const menus: { [key: string]: ContextMenuCommand } = {
  "Validate IGN": validateIgn,
};
