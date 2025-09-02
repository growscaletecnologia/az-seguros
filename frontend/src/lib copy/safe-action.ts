import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createMiddleware,
	createSafeActionClient,
} from "next-safe-action";
import { cookies } from "next/headers";
import { z } from "zod";

class ActionError extends Error {}

// Base client.
export const actionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		});
	},
	handleServerError(e) {
		console.error("Action error:", e.message);

		if (e instanceof ActionError) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	// Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
	console.log("LOGGING MIDDLEWARE");

	const startTime = performance.now();

	// Here we await the action execution.
	const result = await next();

	const endTime = performance.now();

	console.log("Result ->", result);
	console.log("Client input ->", clientInput);
	console.log("Metadata ->", metadata);
	console.log("Action execution took", endTime - startTime, "ms");

	// And then return the result of the awaited action.
	return result;
});

async function getUserIdFromSessionId(session: string) {
	// TODO - criar metodo reutilizavel
	return 1;
}

const httpMiddleware = createMiddleware().define(async ({ next }) => {
	// Do something useful here...
	// Provavlmente um middleware para verificar permissões
	return next({ ctx: { baz: "qux" } });
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
	// Define authorization middleware.
	.use(async ({ next }) => {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		if (!session) {
			throw new Error("Session not found!");
		}

		const userId = await getUserIdFromSessionId(session);

		if (!userId) {
			throw new Error("Session is not valid!");
		}

		// Return the next middleware with `userId` value in the context
		return next({ ctx: { userId } });
	})
	.use(httpMiddleware);
