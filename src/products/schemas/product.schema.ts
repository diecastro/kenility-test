import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true, unique: true, uppercase: true }) sku!: string;
  @Prop({ required: true }) price!: number;
  @Prop() pictureBase64?: string;
  @Prop() pictureMimeType?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
