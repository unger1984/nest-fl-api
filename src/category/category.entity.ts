import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import Project from '../project/project.entity';

@Table({ tableName: 'Category' })
export default class Category extends Model<Category> {
	@AllowNull(false)
	@Column({ type: DataType.STRING })
	title: string;

	@ForeignKey(() => Category)
	@Column({ type: DataType.BIGINT })
	parentId: number;

	@BelongsTo(() => Category)
	parent: Category;

	@HasMany(() => Category)
	child: Category[];

	@HasMany(() => Project)
	projects: Project[];
}
