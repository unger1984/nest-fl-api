import { Module } from '@nestjs/common';

import { ParserService } from './parser.service';
import { DatabaseModule } from '../database/database.module';
import { CategoryModule } from '../category/category.module';
import { ProjectModule } from '../project/project.module';

@Module({
	imports: [DatabaseModule, ProjectModule, CategoryModule],
	providers: [ParserService],
})
export class ParserModule {}
