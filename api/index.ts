import Fastify, { fastify } from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../db/db";

const app = Fastify({
	logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().route({
	method: "GET",
	url: "/api/v1/:uuid",
	// Define your schema
	schema: {
		params: z.object({
			uuid: z.string(),
		}),
	},
	handler: async (req, res) => {
		const realuuid = req.params.uuid.replaceAll("-", "");

		const user = await prisma.user.findFirst({
			where: {
				uuid: realuuid,
			},
		});

		if (!user) {
			res.code(200).send("Invalid User");
		}

		res.code(200).send(user?.discordId);
	},
});

app.listen(
	{
		host: "::",
		port: Number.parseInt(process.env.PORT || "3000"),
	},
	(err, address) => {
		if (err) {
			console.error(err);
		}
	},
);
