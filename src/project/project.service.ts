import { Inject, Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize/types/lib/model';

import Category from '../category/category.entity';
import Project from './project.entity';
import { ApiResponse } from '../apiresponse/apiresponse.service';

@Injectable()
export class ProjectService {
	constructor(
		private readonly apiResponse: ApiResponse,
		@Inject('CategoryRepository') private readonly categoryRepository: typeof Category,
		@Inject('ProjectRepository') private readonly projectRepository: typeof Project,
	) {}

	async getProjects(count: number, page: number, categoryes: number[]): Promise<void> {
		try {
			const where: WhereOptions = {};
			if (categoryes.length > 0) {
				where.categoryId = categoryes;
			}
			const projects = await this.projectRepository.findAndCountAll({
				where,
				include: [
					{
						model: this.categoryRepository,
						as: 'category',
						include: [{ model: this.categoryRepository, as: 'parent' }],
					},
				],
				order: [['flId', 'desc']],
				offset: page * count,
				limit: count,
			});
			this.apiResponse.create(projects);
		} catch (exc) {
			// TODO что-то сделать с ошибкой
			this.apiResponse.create([]);
		}
	}
}
