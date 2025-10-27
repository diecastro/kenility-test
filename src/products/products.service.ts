import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductsDto } from './dto/search-product.dto';
import { buildFilters, buildSort } from 'src/commons/utils/query.utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private model: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    return this.model.create(dto);
  }

  async findById(id: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Product not found');
    return doc;
  }

  async search(query: SearchProductsDto) {
    const { page = 1, limit = 10, sort, name, sku, q } = query;
    const skip = (page - 1) * limit;

    const filters = buildFilters({ name, sku, q });

    const [items, total] = await Promise.all([
      this.model
        .find(filters)
        .sort(buildSort(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filters),
    ]);

    return {
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: items,
    };
  }
}
