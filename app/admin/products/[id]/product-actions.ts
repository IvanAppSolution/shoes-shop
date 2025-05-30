"use server";
import { addProduct, updateProduct } from "@/lib/db";
import { productFormSchemaBE, type ActionResponse } from "@/types/product";
import { put } from '@vercel/blob';
import prisma from "@/lib/prisma";
import { Product } from "@/lib/generated/prisma";
 
export async function formProduct(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {   
    const id = formData.get("id") as string;
    const isAddProduct = formData.get("isAddProduct") === "true";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const brand = formData.get("brand") as string;
    const offerPrice = formData.get("offerPrice") ? Number(formData.get("offerPrice")) : 0;
    const price = formData.get("price") ? Number(formData.get("price")) : 0;
    const inStock = formData.get("inStock") === "true";
    const tags = formData.get("tags") as string;
    const category = formData.get("category") as string;
    const quantity = formData.get("quantity") ? Number(formData.get("quantity")) : 1;
    const images = formData.get("images") 
      ? JSON.parse(formData.get("images") as string)
      : undefined;
    console.log('formProduct: ', images)

    const validatedData = productFormSchemaBE.safeParse({name, price, description, offerPrice, inStock, category, brand, quantity, tags})
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Input form error',
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    let addedProduct:Product;

    if (isAddProduct) {
      console.log('----------- ADD ----------')
      addedProduct = await addProduct({ name, price, description, offerPrice, inStock, category, brand, quantity, tags, images});
      // console.log('addedProduct: ', addedProduct)
      return {
        success: true,
        message: 'Successfully saved!',
        // addedProductId: addedProduct?.id
      }
    } else {
      console.log('----------- UPDATE ----------', id)
      await updateProduct({id, name, price, description, offerPrice, inStock, category, brand, quantity, tags, images});
      return {
        success: true,
        message: 'Successfully updated!'
      }
    }

  } catch (error) {
    console.log('editProduct-error: ', error)
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}
 

type UploadResponse = {
  success: boolean;
  message: string;
  uploadedUrl: string[];
}

export async function uploadFile(
  prevState: UploadResponse | null,
  formData: FormData
): Promise<UploadResponse> {
  try {  
    const files = formData.getAll('files') as File[];
    const uploadedUrl:string[] = [];

   
    if (files && files.length > 0) {     
      for (const file of files) {
        if (file.size <=  1 * 1024 * 1024) {
          const blob = await put(file.name, file, { access: 'public' });  
          uploadedUrl.push(blob.url);
        } else {
          console.log('file too large: ', file.size) 
        }
      }

      // console.log('success uploadFile: ', uploadedUrl)
      return {
        success: true,
        message: 'Successfully uploaded files!',
        uploadedUrl: uploadedUrl
      };
    } else {
      return {
        success: false,
        message: 'Error while uploading!',
        uploadedUrl: []
      };
    }
   
   
  } catch(e) {
    return {
      success: false,
      message: 'Error while uploading!',
      uploadedUrl: []
    };
  }
}

export async function updateProductStock(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const id = formData.get("id") as string;
    const inStock = formData.get("inStock") === "true";

    await prisma.product.update({
      where: { id },
      data: { inStock },
    });

    return {
      success: true,
      message: 'Successfully updated!'
    }

  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred'
    }
  }
}

export async function deleteProduct(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const id = formData.get("id") as string;
    await prisma.product.delete({
      where: { id }
    });

    return {
      success: true,
      message: 'Successfully delete!'
    }

  } catch (error) {
    console.log('delete-error: ', error)
    return {
      success: false,
      message: 'An unexpected error occurred'
    }
  }
}