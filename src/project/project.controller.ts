import { Controller, Get, Query } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ApiResponse } from '../apiresponse/apiresponse.service';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService, private readonly apiResponse: ApiResponse) {}

	@Get()
	async getProjects(
		@Query('count') rcount?: string,
		@Query('page') rpage?: string,
		@Query('categoryes') rcategoryes?: string,
	): Promise<ApiResponse> {
		const count = rcount ? parseInt(rcount) : 20;
		const page = rpage ? parseInt(rpage) - 1 || 0 : 0;
		const categoryes = rcategoryes ? rcategoryes.split(',').map(item => parseInt(item)) : [];
		await this.projectService.getProjects(count, page, categoryes);
		return this.apiResponse;
	}
}
