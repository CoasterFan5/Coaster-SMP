import { z } from "zod";
import { prisma } from "../../db/db";

export const updateWhitelistNames = async () => {
	await prisma.user
		.findMany({
			where: {
				lastUsername: null,
			},
		})
		.then((users) => {
			users.forEach((user) => {
				console.warn(`Updating ${user.discordId} to add a username`);
				fetch(
					`https://api.minecraftservices.com/minecraft/profile/lookup/${user.uuid}`,
				).then((body) => {
					body.json().then((jsonObject) => {
						const zodParse = z
							.object({
								name: z.string(),
								id: z.string(),
							})
							.safeParse(jsonObject);
						if (zodParse.error) {
							console.warn("Could not update username");
							return;
						}
						prisma.user
							.update({
								data: {
									lastUsername: zodParse.data.name,
								},
								where: {
									uuid: user.uuid,
								},
							})
							.then(() => {
								console.log(`User Updated`);
							});
					});
				});
			});
		});
};
