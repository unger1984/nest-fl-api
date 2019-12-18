import { forwardRef, Module } from '@nestjs/common';

import { projectProvider } from './project.provider';
import { DatabaseModule } from '../database/database.module';
import { CategoryModule } from '../category/category.module';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ApiResponseModule } from '../apiresponse/apiresponse.module';

@Module({
	imports: [DatabaseModule, forwardRef(() => CategoryModule), ApiResponseModule],
	controllers: [ProjectController],
	providers: [ProjectService, projectProvider],
	exports: [ProjectService, projectProvider],
})
export class ProjectModule {}
