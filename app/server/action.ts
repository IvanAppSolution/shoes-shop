"use server";
import { revalidateTag } from "next/cache";

 export async function refetchProducts() {    
    revalidateTag("products");
  }