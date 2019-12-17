import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { userProvider } from './user.provider';

@Module({
	imports: [DatabaseModule],
	providers: [userProvider],
	exports: [userProvider],
})
export class UserModule {}
