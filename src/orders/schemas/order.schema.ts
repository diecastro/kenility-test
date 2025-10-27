import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product!: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  price!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  identifier!: string;

  @Prop({ required: true })
  clientName!: string;

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({ type: [OrderItemSchema], default: [] })
  items!: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
