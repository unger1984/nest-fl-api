import { Inject, Injectable } from '@nestjs/common';

import { ApiResponse } from '../apiresponse/apiresponse.service';
import User from './user.entity';
import UserDto from './user.dto';

@Injectable()
export class UserService {
	constructor(
		@Inject('UserRepository') private readonly userRepository: typeof User,
		private readonly apiResponse: ApiResponse,
	) {}

	async create(user: UserDto): Promise<void> {
		try {
			const res = await this.userRepository.create(user);
			await res.save();
			this.apiResponse.create(res);
		} catch (exc) {
			// TODO обработать ошибку
			this.apiResponse.create(null);
		}
	}
}
