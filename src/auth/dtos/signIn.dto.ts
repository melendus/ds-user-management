import { IsEmail, IsString } from '@nestjs/class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
