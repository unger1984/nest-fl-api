import CategoryDto from '../category/category.dto';

export interface ProjectDto {
	flId: string;
	link: string;
	title: string;
	date: Date;
	text?: string;
	price?: string;
	categoryId?: number;
	category?: CategoryDto;
}
