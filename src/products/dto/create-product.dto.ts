import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  sku!: string;
  @IsNumber()
  @Min(0)
  price!: number;
  @IsOptional()
  @IsString()
  pictureBase64?: string;
  @IsOptional()
  @IsString()
  pictureMimeType?: string;
}
