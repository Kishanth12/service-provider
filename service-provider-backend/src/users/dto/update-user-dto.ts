import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'PROVIDER'], {
    message: 'Valid role required',
  })
  role?: 'USER' | 'PROVIDER' | 'ADMIN';
}
