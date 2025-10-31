import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class SearchImagesDto {
  @IsString()
  @IsNotEmpty({ message: 'كلمة البحث مطلوبة' })
  query: string;

  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  perPage?: number = 10;

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsString()
  @IsOptional()
  orientation?: 'landscape' | 'portrait' | 'squarish';

  @IsString()
  @IsOptional()
  color?: string; // e.g., 'blue', 'red', 'green'
}

export class UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  width: number;
  height: number;
  color: string;
  user: {
    name: string;
    username: string;
    portfolio_url: string;
  };
  links: {
    download: string;
    download_location: string;
  };
}

export class SearchImagesResponseDto {
  total: number;
  totalPages: number;
  results: UnsplashImage[];
}
