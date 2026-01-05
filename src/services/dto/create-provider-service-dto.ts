import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProviderServiceDto {
  @IsString()
  @IsNotEmpty()
  serviceTemplateId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
