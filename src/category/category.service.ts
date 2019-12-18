import { Inject, Injectable } from '@nestjs/common';

import Category from './category.entity';
import CategoryDto from './category.dto';
import { ApiResponse } from '../apiresponse/apiresponse.service';

@Injectable()
export class CategoryService {
	constructor(
		@Inject('CategoryRepository') private readonly categoryRepository: typeof Category,
		private readonly apiResponse: ApiResponse,
	) {}

	async findAll(parentId?: number): Promise<void> {
		try {
			const categoryes = await this.categoryRepository.findAll({
				where: { parentId: parentId },
				include: [
					{
						model: this.categoryRepository,
						as: 'child',
						include: [{ model: this.categoryRepository, as: 'child' }],
					},
				],
			});
			this.apiResponse.create(categoryes);
		} catch (exc) {
			// TODO обработать ошибку
			this.apiResponse.create([]);
		}
	}

	async findOne(id: number): Promise<void> {
		try {
			const category = await this.categoryRepository.findOne({
				where: { id: id },
				include: [{ model: this.categoryRepository, as: 'child', include: [{ model: Category, as: 'child' }] }],
			});
			this.apiResponse.create(category);
		} catch (exc) {
			// TODO обработать ошибку
			this.apiResponse.create(null);
		}
	}

	async create(category: CategoryDto): Promise<void> {
		try {
			const res = await this.categoryRepository.create(category);
			await res.save();
			this.apiResponse.create(res);
		} catch (exc) {
			// TODO обработать ошибку
			this.apiResponse.create(null);
		}
	}
}
