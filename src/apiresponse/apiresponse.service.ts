import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ApiResponse {
	private status: boolean;
	private data: any;
	private error: {
		code: number;
		message: string;
		exception?: any;
	};

	constructor() {
		this.status = false;
		this.error = {
			code: 501,
			message: 'Not Implemented',
		};
	}

	create(data: any) {
		this.status = true;
		this.data = data;
		this.error = undefined;
	}

	throw(code: number, message: string, exception?: any) {
		this.status = false;
		this.error = { code, message, exception };
		this.data = undefined;
	}
}
