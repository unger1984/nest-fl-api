import Category from './category.entity';
import Project from '../project/project.entity';

export default interface CategoryDto {
	title: string;
	parentId?: number;
	parent?: Category;
	child?: Category[];
	projects?: Project[];
}
