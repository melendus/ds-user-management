import { IsOptional, IsString } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  password?: string;

  @IsString()
  email?: string;
}
