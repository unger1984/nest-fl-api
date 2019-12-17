type ConfigDBOptions = {
	dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql' | undefined;
	host: string;
	port: number;
	logging: boolean | ((sql: string) => void);
	dialectOptions: {
		useUTC: boolean;
	};
	timezone: string;
};

type ConfigInterface = {
	SSL_SERVER_KEY: string;
	SSL_SERVER_CRT: string;
	HTTP_SERVER_HOST: string;
	HTTP_SERVER_PORT: string;
	db: {
		username: string;
		password: string;
		database: string;
		options: ConfigDBOptions;
	};
};

export default (): ConfigInterface => ({
	SSL_SERVER_KEY: '',
	SSL_SERVER_CRT: '',
	HTTP_SERVER_HOST: '',
	HTTP_SERVER_PORT: '',
	...process.env,
	db: {
		username: process.env.DB_USER || 'root',
		password: process.env.DB_PASS || '',
		database: process.env.DB_BASE || 'test',
		options: {
			dialect: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT || '5432'),
			logging: process.env.NODE_ENV !== 'production',
			dialectOptions: {
				useUTC: false, // for reading from database
			},
			timezone: '+03:00',
		},
	},
});
