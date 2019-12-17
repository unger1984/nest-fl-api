import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Umzug from 'umzug';

@Injectable()
export class AppService implements OnApplicationBootstrap {
	private umzug;

	constructor(private configService: ConfigService, @Inject('Sequelize') private readonly sequelize) {
		this.umzug = new Umzug({
			storage: 'sequelize',
			storageOptions: {
				sequelize: this.sequelize,
			},
			migrations: {
				params: [
					this.sequelize.getQueryInterface(), // queryInterface
					this.sequelize.constructor,
					() => {
						throw new Error(
							'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.',
						);
					},
				],
			},
		});
	}

	onApplicationBootstrap(): any {
		this.migrate();
	}

	async migrate() {
		return await new Promise((response, reject) => {
			this.umzug
				.up()
				.then(migrations => {
					migrations.map(mig => {
						// eslint-disable-next-line no-console
						console.log(`Migrate ${mig.file}`);
					});
				})
				.then(() => response())
				.catch(exc => reject(exc));
		});
	}
}
