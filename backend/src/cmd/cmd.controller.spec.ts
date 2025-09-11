import { Test, TestingModule } from "@nestjs/testing";
import { CmdController } from "./cmd.controller";
import { CmdService } from "./cmd.service";

describe("CmdController", () => {
	let controller: CmdController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CmdController],
			providers: [CmdService],
		}).compile();

		controller = module.get<CmdController>(CmdController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
