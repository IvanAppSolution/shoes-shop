"use client";
import ProductCard from "@/components/ui/product-card";
import ProductsFilter from "@/components/ui/products-filter";
import { Product } from "@/lib/generated/prisma";
 
export default function Content({products}: {products: Product[]|[]} ) {
  
  return (
    <div className='mt-10 flex flex-col '>
      <div className='flex flex-col items-end w-max mb-2'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>        
      </div>
      <ProductsFilter  />

        <div className='grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 mt-6'>
           {products ? products.map((product, index)=> (
            <ProductCard key={product.id} product={product}/>
          )) : null}
        </div>

    </div>
  )
}