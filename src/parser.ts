import { NestFactory } from '@nestjs/core';

import { ParserModule } from './parser/parser.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice(ParserModule);
	app.listen(() => console.log('Parser started'));
}

bootstrap();
