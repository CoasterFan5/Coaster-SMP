declare global {
	namespace NodeJS {
		interface ProcessEnv {
			app_id: string;
			token: string;
			db_url: string;
		}
	}
}

export {};
