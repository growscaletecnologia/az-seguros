import { api } from "@/lib/api";

export interface Log {
	id: string;
	userId: string | null;
	path: string;
	method: string;
	statusCode: number;
	userAgent: string | null;
	ip: string | null;
	requestBody: any | null;
	responseTime: number;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	} | null;
}

export interface LogsResponse {
	data: Log[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface LogsParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	path?: string;
	method?: string;
	statusCode?: number;
	userId?: string;
}

class LogsService {
	async getLogs(params: LogsParams = {}): Promise<LogsResponse> {
		const {
			page = 1,
			limit = 10,
			sortBy = "createdAt",
			sortOrder = "desc",
			path,
			method,
			statusCode,
			userId,
		} = params;

		const queryParams = new URLSearchParams();
		queryParams.append("page", page.toString());
		queryParams.append("limit", limit.toString());
		queryParams.append("sortBy", sortBy);
		queryParams.append("sortOrder", sortOrder);

		if (path) queryParams.append("path", path);
		if (method) queryParams.append("method", method);
		if (statusCode) queryParams.append("statusCode", statusCode.toString());
		if (userId) queryParams.append("userId", userId);

		const response = await api.get<LogsResponse>(
			`/logs?${queryParams.toString()}`,
		);
		return response.data;
	}

	async getLog(id: string): Promise<Log> {
		const response = await api.get<Log>(`/logs/${id}`);
		return response.data;
	}
}

export const logsService = new LogsService();
