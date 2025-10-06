import { Injectable } from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';

@Injectable()
export class InsuranceService {
  create(createInsuranceDto: CreateInsuranceDto) {
    return 'This action adds a new insurance';
  }

  findAll() {
    return `This action returns all insurance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} insurance`;
  }

  update(id: number, updateInsuranceDto: UpdateInsuranceDto) {
    return `This action updates a #${id} insurance`;
  }

  remove(id: number) {
    return `This action removes a #${id} insurance`;
  }
}
