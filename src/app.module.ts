import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';

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
export class AppModule {}
