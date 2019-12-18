import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';

import { CategoryService } from './category.service';
import CategoryDto from './category.dto';
import { ApiResponse } from '../apiresponse/apiresponse.service';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService, private readonly apiResponse: ApiResponse) {}

	@Get()
	async get(@Query('parentId') parentId?: number): Promise<ApiResponse> {
		await this.categoryService.findAll(parentId ? parentId : null)
		return this.apiResponse;
	}

	@Get(':id')
	async findOne(@Param('id') id): Promise<ApiResponse> {
		await this.categoryService.findOne(id)
		return this.apiResponse;
	}

	@Put()
	async create(@Body() category: CategoryDto): Promise<ApiResponse> {
		await this.categoryService.create(category)
		return this.apiResponse;
	}

	// @Post('test')
	// @UseInterceptors(FileInterceptor('attach'))
	// test(@Body() body: object, @UploadedFile() attach): void {
	// 	console.log('body', attach, body);
	// }
}
