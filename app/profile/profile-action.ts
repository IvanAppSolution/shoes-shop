"use server";
import { updateUser, updateUserAddress } from "@/lib/db";
import { UserFormData, userFormSchema } from "@/types/user";

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof UserFormData]?: string[];
  };
}

export async function updateUserInfo(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const userId = formData.get("userId") as string; 
    const email = formData.get("email") as string; 
    const name = formData.get("name") as string; 
    const addressId = formData.get("addressId") as string; 
    const phone = formData.get("phone") as string; 
    const state = formData.get("state") as string; 
    const city = formData.get("city") as string;
    const street = formData.get("street") as string; 
    const zipcode = formData.get("zipcode") as string; 

    const validatedData = userFormSchema.safeParse({
      email,
      name,
      phone,
      state,
      city,
      street,
      zipcode
    });

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Input form error',
        errors: validatedData.error.flatten().fieldErrors,
      }
    }  

    console.log('----------- UPDATE User----------', userId)
    await updateUser ({userId, email, name});
    await updateUserAddress({ addressId, state, street, zipcode, phone, city });
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