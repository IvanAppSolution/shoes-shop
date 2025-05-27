"use client";
import { Product } from "@/lib/generated/prisma";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/components/context";
import ProductCard from "@/components/ui/product-card";

export default function RelatedProducts() {
  const {getRelatedProducts, viewProductId, shuffleArray} = useContext(AppContext);
  const [products, setProducts ] = useState<Product[]>([]);
  const router = useRouter();

  async function getProducts(productId: string) {
    if (productId) {
      try {
        const _relatedProducts: Product[] = await getRelatedProducts(productId);
        setProducts(shuffleArray(_relatedProducts));
      } catch (error) {
        console.error("Error fetching related products: ", error);
      }
    }
  }

  useEffect(() => {
    getProducts(viewProductId)
    // setProducts(data);
  }, [viewProductId])

  return (
    <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 mt-6 w-full">
            {products ? products.filter((product)=>product.inStock).map((product, index)=>(
                <ProductCard key={index} product={product}/>
            )) : null}
        </div>
        <button onClick={()=> {router.push('/products'); scrollTo(0,0)}} className="mx-auhref cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
    </div>
  )
}