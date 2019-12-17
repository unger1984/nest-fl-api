import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { AppModule } from './app.module';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

const ssl = {
	key: readFileSync(resolve(__dirname, '../ssl', 'server.key')),
	cert: readFileSync(resolve(__dirname, '../ssl', 'server.crt')),
};

async function bootstrap() {
	let httpsOptions: HttpsOptions = undefined;
	if (process.env.NODE_ENV !== 'production') {
		httpsOptions = {
			key: ssl.key,
			cert: ssl.cert,
		};
	}

	const app = await NestFactory.create(AppModule, {
		httpsOptions,
	});
	const configService: ConfigService = app.get(ConfigService);
	app.setGlobalPrefix('/api');
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({ limit: '1mb' }));
	await app.listen(configService.get('HTTP_SERVER_PORT'), configService.get('HTTP_SERVER_HOST'));
}

bootstrap();
