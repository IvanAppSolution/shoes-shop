import React, { Suspense } from 'react'
import { SearchParams} from 'nuqs';
import { Product } from '@/lib/generated/prisma';
import { getProducts } from '@/lib/db';
import Content from './content';
import ProductsPagination from '@/components/ui/products-pagination';
import { revalidateTag } from "next/cache";
import { loadSearchParams } from '@/lib/search-params';
// import { refetchProducts } from '@/app/server/action';

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function AdminProducts ({searchParams}: PageProps) {
  let { search, perPage, offset } = await loadSearchParams(searchParams);
  const products = getProducts({search, perPage, offset});// as [Product[], number];
  // console.log('admin-ProductList: ', products.length)
   
  async function refetchProducts() {
    "use server";
    revalidateTag("products");
  }

  return (
    <Suspense fallback={<div className='col-span-5 text-center'>Loading products...</div>}>
      <Content productListPromise={products} refetchProducts={refetchProducts} />
       
    </Suspense>    
  )
}