import { Module } from '@nestjs/common';
import { ApiResponse } from './apiresponse.service';

@Module({
	providers: [ApiResponse],
	exports: [ApiResponse],
})
export class ApiResponseModule {}
