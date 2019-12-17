import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import config from './config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [config] }),
		DatabaseModule,
		ProjectModule,
		CategoryModule,
		UserModule,
	],
	providers: [AppService],
})
export class AppModule {
	constructor(private readonly appService: AppService) {
		appService.migrate();
	}
}
