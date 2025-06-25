import type { ContextMenuCommand } from "./Types";
import { validateIgn } from "./verifyIgn";

export const menus: Record<string, ContextMenuCommand> = {
	"Validate IGN": validateIgn,
};
