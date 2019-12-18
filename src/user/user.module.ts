import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { userProvider } from './user.provider';
import { ApiResponseModule } from '../apiresponse/apiresponse.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [DatabaseModule, ApiResponseModule],
	controllers: [UserController],
	providers: [UserService, userProvider],
	exports: [UserService, userProvider],
})
export class UserModule {}
