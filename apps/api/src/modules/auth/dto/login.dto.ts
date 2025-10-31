import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email: string;

  @IsString({ message: 'كلمة المرور مطلوبة' })
  @MinLength(1, { message: 'كلمة المرور مطلوبة' })
  password: string;
}
