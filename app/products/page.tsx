import { SearchParams } from 'nuqs';
import ProductsPagination from '@/components/ui/products-pagination'; 
import { shuffleArray } from '@/lib/utils';
import { loadSearchParams } from '@/lib/search-params';
import { refetchProducts } from '../server/action';
import ProductCard from "@/components/ui/product-card";
import ProductsFilter from "@/components/ui/products-filter";
import { Product } from "@/lib/generated/prisma";
import { getProducts } from '@/lib/db';
import { Suspense } from 'react';

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Products ({searchParams}: PageProps) {
  const { search, brand, perPage, offset } = await loadSearchParams(searchParams)
  const [products, count] = await getProducts({search, brand, perPage, offset}) as [Product[] | [], number];
    
  return (
    <>
      <div className='mt-10 flex flex-col '>
        <div className='flex flex-col items-end w-max mb-2'>
          <p className='text-2xl font-medium uppercase'>All products</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>        
        </div>
        <ProductsFilter  />
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 mt-6'>
              <Suspense fallback={<div className='col-span-5 text-center'>Loading products...</div>}>
                {products ? shuffleArray(products).map((product, index)=> (
                  <ProductCard key={index} product={product}/>
                )) : null}
              </Suspense>
          </div>
      </div>
      <ProductsPagination  searchResultCount={count} refetchProducts={refetchProducts} />
    </>
  )
}
