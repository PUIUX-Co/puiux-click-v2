import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email: string;

  @IsString({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(128, { message: 'كلمة المرور طويلة جداً' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم' }
  )
  password: string;

  @IsString({ message: 'الاسم مطلوب' })
  @MinLength(2, { message: 'الاسم قصير جداً' })
  @MaxLength(100, { message: 'الاسم طويل جداً' })
  name: string;

  @IsString({ message: 'اسم المنظمة مطلوب' })
  @MinLength(2, { message: 'اسم المنظمة قصير جداً' })
  @MaxLength(100, { message: 'اسم المنظمة طويل جداً' })
  organizationName: string;
}
