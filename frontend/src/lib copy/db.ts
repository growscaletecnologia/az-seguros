import CONSTANTS from "@/constants";
import type { ConnectionPool } from "mssql";
import sql from "mssql";

const config: sql.config = {
	user: CONSTANTS.APP_ENV.DB_USER,
	database: CONSTANTS.APP_ENV.DB_DATABASE,
	port: CONSTANTS.APP_ENV.DB_PORT,
	server: CONSTANTS.APP_ENV.DB_SERVER,
	password: CONSTANTS.APP_ENV.DB_PASSWORD,
	options: {
		encrypt: CONSTANTS.APP_ENV.NODE_ENV !== "development",
		trustServerCertificate: CONSTANTS.APP_ENV.NODE_ENV !== "development",
	},
};

let pool: ConnectionPool | null = null;

export async function getConnection() {
	if (pool) return pool;
	pool = await sql.connect(config);
	return pool;
}

export async function closeConnection() {
	if (pool) await pool.close();
	pool = null;
}
