import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from '../config';
import { ParserService } from './parser.service';
import { DatabaseModule } from '../database/database.module';
import { CategoryModule } from '../category/category.module';
import { ProjectModule } from '../project/project.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), DatabaseModule, ProjectModule, CategoryModule],
	providers: [ParserService],
})
export class ParserModule {}
