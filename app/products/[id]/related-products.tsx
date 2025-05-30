import { Product } from "@/lib/generated/prisma";
import ProductCard from "@/components/ui/product-card";
import { shuffleArray } from "@/lib/utils";
import { getRelatedProducts } from "@/lib/db";
import Link from "next/link";

export default async function RelatedProducts({productId}: {productId?: string}) {
  const products = await getRelatedProducts({ productId: productId ?? "" }) as Product[] | undefined;

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
        <Link href={`/products`}  > 
          <button   className="mx-auhref cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
        </Link>
    </div>
  )
}