import { IsInt, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class AssignBenefitsDto {
  @IsInt()
  planId: number;

  @IsArray()
  @ArrayNotEmpty()
  benefitIds: number[]; // ou codes, se preferir (ajustamos no repo)

  @IsOptional()
  skipDuplicates?: boolean = true;
}
