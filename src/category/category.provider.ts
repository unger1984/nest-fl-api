import Category from './category.entity';

export const categoryProvider = {
	provide: 'CategoryRepository',
	useValue: Category,
};
