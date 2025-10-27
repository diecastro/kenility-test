import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchProductsDto } from './dto/search-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Product',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Pizza' },
        sku: { type: 'string', example: '001' },
        price: { type: 'number', example: 19.99 },
        picture: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
      },
      required: ['name', 'sku', 'price'],
    },
  })
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @Post()
  @UseInterceptors(FileInterceptor('picture', { storage: memoryStorage() }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    let pictureBase64: string | undefined;
    let pictureMimeType: string | undefined;

    if (file) {
      pictureBase64 = file.buffer.toString('base64');
      pictureMimeType = file.mimetype;
    }

    return this.products.create({ ...body, pictureBase64, pictureMimeType });
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findById(id);
  }

  @ApiOperation({
    summary: 'Search products',
  })
  @ApiResponse({ status: 200, description: 'List of products' })
  @Get()
  search(@Query() query: SearchProductsDto) {
    return this.products.search(query);
  }
}
