import { forwardRef, Module } from '@nestjs/common';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProvider } from './category.provider';
import { DatabaseModule } from '../database/database.module';
import { ProjectModule } from '../project/project.module';

@Module({
	imports: [DatabaseModule, forwardRef(() => ProjectModule)],
	controllers: [CategoryController],
	providers: [CategoryService, categoryProvider],
	exports: [CategoryService, categoryProvider],
})
export class CategoryModule {}
