import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
