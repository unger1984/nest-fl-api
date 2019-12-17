import { Inject, Injectable } from '@nestjs/common';

import Category from './category.entity';
import CategoryDto from './category.dto';
import Project from '../project/project.entity';

@Injectable()
export class CategoryService {
	constructor(
		@Inject('CategoryRepository') private readonly categoryRepository: typeof Category,
		@Inject('ProjectRepository') private readonly projectRepository: typeof Project,
	) {}

	async findAll(parentId?: number): Promise<Category[]> {
		try {
			const categoryes = await this.categoryRepository.findAll({
				where: { parentId: parentId },
				include: [
					{
						model: this.categoryRepository,
						as: 'child',
						include: [{ model: this.categoryRepository, as: 'child' }],
					},
					{ model: this.projectRepository, as: 'projects' },
				],
			});
			return categoryes;
		} catch (exc) {
			return [];
		}
	}

	async findOne(id: number): Promise<Category> {
		try {
			const category = await this.categoryRepository.findOne({
				where: { id: id },
				include: [{ model: this.categoryRepository, as: 'child', include: [{ model: Category, as: 'child' }] }],
			});
			return category;
		} catch (exc) {
			return null;
		}
	}

	async create(category: CategoryDto): Promise<Category> {
		try {
			const res = await this.categoryRepository.create(category);
			await res.save();
			return res;
		} catch (exc) {
			return null;
		}
	}
}
