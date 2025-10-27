import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing order' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch(':identifier')
  update(@Param('identifier') identifier: string, @Body() dto: UpdateOrderDto) {
    return this.orders.update(identifier, dto);
  }

  @ApiOperation({ summary: 'Get order with highest amount' })
  @Get('analytics/highest')
  highest() {
    return this.orders.highestAmountOrder();
  }

  @ApiOperation({ summary: 'Get total sold amount in the last month' })
  @Get('analytics/last-month-total')
  lastMonthTotal() {
    return this.orders.totalSoldLastMonth();
  }
}
