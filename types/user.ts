import { z } from "zod";

export type UserFormData = {
  name: string;
  email: string;
  phone?: string;
  state?: string;
  city?: string;
  street?: string;
  zipcode?: string;
};

export const userFormSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().min(3).max(255),
  phone: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  zipcode: z.string(),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;