import { Body, Controller, Put } from '@nestjs/common';

import { UserService } from './user.service';
import UserDto from './user.dto';
import { ApiResponse } from '../apiresponse/apiresponse.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService, private readonly apiResponse: ApiResponse) {}

	@Put()
	async create(@Body() user: UserDto): Promise<ApiResponse> {
		await this.userService.create(user);
		return this.apiResponse;
	}
}
