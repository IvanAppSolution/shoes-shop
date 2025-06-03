import { z } from "zod";

export type ProductFormData = {
  name: string;
  brand: string;
  description?: string;
  category?: string;
  price?: string;
  offerPrice?: string;
  inStock?: string;
  tags?: string;
  quantity?: string;
  updatedImage?: []
};

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof ProductFormData]?: string[];
  };
  addedProductId?: string;
}

export const productFormSchemaBE = z.object({
  name: z.string().min(3).max(255),
  brand: z.string().min(1).max(255),
  description: z.string(),  
  category: z.string(),
  price: z.number(),
  offerPrice: z.number(),
  inStock: z.boolean(),
  tags: z.string(),
  quantity: z.number(),
});

export const productFormSchemaFE = z.object({
  name: z.string().min(3).max(255),
  brand: z.string().min(1).max(255),
  description: z.string(),  
  category: z.string(),
  price: z.string(),
  offerPrice: z.string(),
  inStock: z.string(),
  tags: z.string(),
  quantity: z.string(),
});

export type ProductFormSchemaBE = z.infer<typeof productFormSchemaBE>;
export type ProductFormSchemaFE = z.infer<typeof productFormSchemaFE>;
