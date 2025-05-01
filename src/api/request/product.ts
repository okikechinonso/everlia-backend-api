import * as Joi from '@hapi/joi';
import { Product } from "../../types/product"


const categories = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.object({
        en: Joi.string().required()
    }).required()
});

const variant = Joi.object({
    price: Joi.number().precision(2).required(),
    originalPrice: Joi.string().regex(/^\d+(\.\d{2})?$/).required(),
    quantity: Joi.number().integer().min(0).required(),
    discount: Joi.string().regex(/^\d+(\.\d{2})?$/).required(),
    productId: Joi.string().pattern(/^[0-9a-f]{24}-\d+$/).required(),
    barcode: Joi.string().allow('').required(),
    image: Joi.string().required()
});

export const productSchema = Joi.object<Product>({
  barcode: Joi.string().allow(null, ''),
  title: Joi.object().required(),
  description: Joi.object().optional(),
  slug: Joi.string().required(),
  categories: Joi.array().items(categories).required(),
  image: Joi.when("variants", {
    is: Joi.exist(),
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.array().items(Joi.string()).required()
  }),
  category: categories,
  stock: Joi.number().required(),
  tag: Joi.array().items(Joi.string()).optional(),
  prices: Joi.object({
    originalPrice: Joi.number().required(),
    price: Joi.number().required(),
    discount: Joi.number().optional()
  }).required(),
  variants: Joi.array().items(variant).optional(),
  status: Joi.string().valid('show', 'hide').optional(),
  isCombination: Joi.boolean().default(false),
});

export function validateCreateProduct(product: any): Joi.ValidationResult {
  return productSchema.validate(product);
}

