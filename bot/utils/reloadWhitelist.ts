import { prisma } from "../../db/db";
import { parse } from "uuid";

export const reloadWhitelist = async () => {
  const whitelistUsers = await prisma.user.findMany();

  const whitelistJson = whitelistUsers.map((item) => {
    const u = [
      item.uuid.substring(0, 8),
      item.uuid.substring(8, 12),
      item.uuid.substring(12, 16),
      item.uuid.substring(16, 20),
      item.uuid.substring(20),
    ].join("-");

    try {
      parse(u);
    } catch (e) {
      throw e;
    }

    return {
      uuid: u.toString(),
      name: "",
    };
  });

  const whitelistString = JSON.stringify(whitelistJson, null, 4);

  const pteroUrlRaw = process.env.PTERO_HOST;
  const pteroServerId = process.env.PTERO_SERVER_ID;
  const pteroToken = process.env.PTERO_TOKEN;
  if (!pteroUrlRaw || !pteroServerId || !pteroToken) {
    throw "Error getting Pterodactyl Environment";
  }

  const panelUrl = new URL(pteroUrlRaw);

  const filePost = await fetch(
    `${panelUrl.origin}/api/client/servers/${pteroServerId}/files/write?file=whitelist.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pteroToken}`,
      },
      body: whitelistString,
    },
  );

  if (filePost.status != 204) {
    console.warn(filePost);
    throw "Error putting whitelist.json";
  }

  const commandPost = await fetch(
    `${panelUrl.origin}/api/client/servers/${pteroServerId}/command`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pteroToken}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        command: "whitelist reload",
      }),
    },
  );

  if (commandPost.status != 204) {
    console.warn(commandPost);
    throw "Error sending reload command";
  }

  return {
    whitelistString,
  };
};
