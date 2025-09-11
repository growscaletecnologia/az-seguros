import { Injectable } from "@nestjs/common";
import { CreateCmdDto } from "./dto/create-cmd.dto";
import { UpdateCmdDto } from "./dto/update-cmd.dto";

@Injectable()
export class CmdService {
	create(createCmdDto: CreateCmdDto) {
		return "This action adds a new cmd";
	}

	findAll() {
		return `This action returns all cmd`;
	}

	findOne(id: number) {
		return `This action returns a #${id} cmd`;
	}

	update(id: number, updateCmdDto: UpdateCmdDto) {
		return `This action updates a #${id} cmd`;
	}

	remove(id: number) {
		return `This action removes a #${id} cmd`;
	}
}
