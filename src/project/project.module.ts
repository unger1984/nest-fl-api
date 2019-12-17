import { forwardRef, Module } from '@nestjs/common';

import { projectProvider } from './project.provider';
import { DatabaseModule } from '../database/database.module';
import { CategoryModule } from '../category/category.module';

@Module({
	imports: [DatabaseModule, forwardRef(() => CategoryModule)],
	providers: [projectProvider],
	exports: [projectProvider],
})
export class ProjectModule {}
