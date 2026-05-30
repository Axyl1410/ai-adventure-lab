import "dotenv/config";
import { ensureDatabase } from "./db/ensureDatabase";
import { createServer } from "./server";

const port = Number(process.env.API_PORT ?? 3001);

ensureDatabase()
	.then(() => {
		createServer().listen(port, () => {
			console.log(`AI Adventure Lab API listening on ${port}`);
		});
	})
	.catch((error) => {
		console.error("Could not initialize database", error);
		process.exit(1);
	});
