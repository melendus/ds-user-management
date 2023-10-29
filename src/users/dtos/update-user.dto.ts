import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from '@nestjs/class-validator';
import { Role } from '../../public/enums/role.enum';

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsOptional()
  role?: Role;
}
