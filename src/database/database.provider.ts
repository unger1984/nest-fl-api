import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';

export const databaseProvider = {
	provide: 'Sequelize',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const sequelize = new Sequelize(
			configService.get('db.database'),
			configService.get('db.username'),
			configService.get('db.password'),
			{
				...configService.get('db.options'),
				// eslint-disable-next-line no-console
				logging: configService.get('db.options').logging ? sql => console.log(sql) : false,
			},
		);
		sequelize.addModels([`${__dirname}/../**/!(index).entity.{ts,js}`]);
		return sequelize;
	},
};
