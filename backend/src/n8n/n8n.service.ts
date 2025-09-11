import { Injectable } from "@nestjs/common";
import { CreateN8nDto } from "./dto/create-n8n.dto";
import { UpdateN8nDto } from "./dto/update-n8n.dto";

@Injectable()
export class N8nService {
	create(createN8nDto: CreateN8nDto) {
		return "This action adds a new n8n";
	}

	findAll() {
		return `This action returns all n8n`;
	}

	findOne(id: number) {
		return `This action returns a #${id} n8n`;
	}

	update(id: number, updateN8nDto: UpdateN8nDto) {
		return `This action updates a #${id} n8n`;
	}

	remove(id: number) {
		return `This action removes a #${id} n8n`;
	}
}
