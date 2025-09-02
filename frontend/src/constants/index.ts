import { z } from "zod";

const appEnvSchema = z.object({
	NEXT_PUBLIC_CUSTOMER: z.string({
		message: "Variável de ambiente NEXT_PUBLIC_CUSTOMER faltando.",
	}),
	NODE_ENV: z.enum(["development", "production"]),
	DB_SERVER: z.string({ message: "Variável de ambiente DB_SERVER faltando." }),
	DB_DATABASE: z.string({ message: "Variável de ambiente DB_DATABASE faltando." }),
	DB_USER: z.string({ message: "Variável de ambiente DB_USER faltando." }),
	DB_PASSWORD: z.string({ message: "Variável de ambiente DB_PASSWORD faltando." }),
	DB_PORT: z
		.string({ message: "Variável de ambiente DB_PORT faltando." })
		.transform((arg, ctx) => {
			return Number(arg);
		})
		.refine((arg) => typeof arg === "number" && !Number.isNaN(arg), {
			message: "DB_PORT precisa ser um número válido",
		}),
});

const APP_ENV = appEnvSchema.parse(process.env);

const CONSTANTS = {
	APP_ENV,
};

export default CONSTANTS;
