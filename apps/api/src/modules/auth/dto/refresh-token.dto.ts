import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'رمز التحديث مطلوب' })
  @IsNotEmpty({ message: 'رمز التحديث لا يمكن أن يكون فارغاً' })
  refreshToken: string;
}
