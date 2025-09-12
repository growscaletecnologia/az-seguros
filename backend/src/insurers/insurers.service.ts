import { Injectable } from '@nestjs/common'
import { CreateInsurerDto } from './dto/create-insurer.dto'
import { UpdateInsurerDto } from './dto/update-insurer.dto'

@Injectable()
export class InsurersService {
  create(createInsurerDto: CreateInsurerDto) {
    return 'This action adds a new insurer'
  }

  findAll() {
    return `This action returns all insurers`
  }

  findOne(id: number) {
    return `This action returns a #${id} insurer`
  }

  update(id: number, updateInsurerDto: UpdateInsurerDto) {
    return `This action updates a #${id} insurer`
  }

  remove(id: number) {
    return `This action removes a #${id} insurer`
  }
}
