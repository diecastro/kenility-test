import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateOrderDto) {
    try {
      const skus = dto.items.map((i) => i.sku);
      const products = await this.productModel
        .find({ sku: { $in: skus } })
        .lean();

      if (products.length !== dto.items.length) {
        throw new BadRequestException('One or more products do not exist');
      }

      const items = dto.items.map((item) => {
        const product = products.find((p) => p.sku === item.sku);
        if (!product)
          throw new NotFoundException(`Product ${item.sku} not found`);
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return await this.orderModel.create({
        identifier: dto.identifier,
        clientName: dto.clientName,
        total,
        items,
      });
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.identifier) {
        throw new BadRequestException(
          `Order with identifier "${error.keyValue?.identifier}" already exists.`,
        );
      }
      throw error;
    }
  }

  async update(identifier: string, dto: UpdateOrderDto) {
    try {
      if (dto.items && dto.items.length > 0) {
        const skus = dto.items.map((i) => i.sku);
        const products = await this.productModel
          .find({ sku: { $in: skus } })
          .lean();

        if (products.length !== dto.items.length) {
          throw new BadRequestException('One or more products do not exist');
        }

        const items = dto.items.map((item) => {
          const product = products.find((p) => p.sku === item.sku);
          if (!product)
            throw new NotFoundException(`Product ${item.sku} not found`);
          return {
            product: product._id,
            quantity: item.quantity,
            price: product.price,
          };
        });

        dto.total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        dto.items = items as any;
      }

      const updatedOrder = await this.orderModel
        .findOneAndUpdate({ identifier }, dto, { new: true })
        .populate('items.product', 'name sku pictureBase64 pictureMimeType')
        .lean();

      if (!updatedOrder) {
        throw new NotFoundException(
          `Order with identifier "${identifier}" not found`,
        );
      }

      return updatedOrder;
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.identifier) {
        throw new BadRequestException(
          `Order with identifier "${error.keyValue?.identifier}" already exists.`,
        );
      }
      throw error;
    }
  }

  async highestAmountOrder() {
    const [order] = await this.orderModel.aggregate([
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    return order || null;
  }

  async totalSoldLastMonth() {
    const now = new Date();
    const from = new Date(now);
    from.setMonth(now.getMonth() - 1);

    const result = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: from, $lte: now } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
      { $project: { _id: 0, total: 1 } },
    ]);
    return result[0] || { total: 0 };
  }
}
