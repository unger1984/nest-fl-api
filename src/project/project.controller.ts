import { Controller, Get, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import Project from './project.entity';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get()
	async getProjects(
		@Query('count') rcount?: string,
		@Query('page') rpage?: string,
		@Query('categoryes') rcategoryes?: string,
	): Promise<Project[]> {
		const count = rcount ? parseInt(rcount) : 20;
		const page = rpage ? parseInt(rpage) - 1 || 0 : 0;
		const categoryes = rcategoryes ? rcategoryes.split(',').map(item => parseInt(item)) : [];
		return this.projectService.getProjects(count, page, categoryes);
	}
}
