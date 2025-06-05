import { getCartItemProductsByArray, getCartItems } from "@/lib/db";
import Content from "./content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Product } from "@/lib/generated/prisma";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export default async function Cart() {
  const session = await auth.api.getSession({
      headers: await headers()
  })

  // let products = Promise.resolve<Product[]>([]);

  if (session) {
    const data = await getCartItems(session.user.id);

    if (data && data.cartItems && Object.keys(data.cartItems).length > 0) {
        let productsArray = []        
        for(const key in data.cartItems as any) {
            productsArray.push(key)
        }
        console.log("productsArray", productsArray);
        const products = getCartItemProductsByArray(productsArray);
        console.log("products", products);
        return (
          <Suspense fallback={<div className='col-span-5 text-center'>Loading cart...</div>}>
            <Content productsPromise={products} />
          </Suspense>
        )
    }
  } else {
    return <div className="m-48 text-center">Please sign in to view your cart.<br/><br/>
      <a href="/sign-in" className="text-blue-500 hover:underline"><Button>Sign In</Button></a>
    </div>;
  }

  
}