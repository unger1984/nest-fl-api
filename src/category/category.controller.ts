import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import CategoryDto from './category.dto';
import Category from './category.entity';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async get(@Query('parentId') parentId?: number): Promise<Category[]> {
		return await this.categoryService.findAll(parentId ? parentId : null);
	}

	@Get(':id')
	async findOne(@Param('id') id): Promise<Category> {
		return await this.categoryService.findOne(id);
	}

	@Put()
	async create(@Body() category: CategoryDto): Promise<Category> {
		return await this.categoryService.create(category);
	}

	// @Post('test')
	// @UseInterceptors(FileInterceptor('attach'))
	// test(@Body() body: object, @UploadedFile() attach): void {
	// 	console.log('body', attach, body);
	// }
}
