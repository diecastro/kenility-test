import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  page = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  q?: string;
}
