import { IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateProviderServiceDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
