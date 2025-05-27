import React from 'react'
import { SearchParams} from 'nuqs';
import { Product } from '@/lib/generated/prisma';
import { getProducts } from '@/lib/db';
import Content from './content';
import ProductsPagination from '@/components/ui/products-pagination';
import { revalidateTag } from "next/cache";
import { loadSearchParams } from '@/lib/search-params';

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function AdminProducts ({searchParams}: PageProps) {
  let { search, perPage, offset } = await loadSearchParams(searchParams);
  const [products, count] = await getProducts({search, perPage, offset}) as [Product[] | [], number];
  console.log('admin-ProductList: ', products.length)
   
  async function refetchProducts() {
    "use server";
    revalidateTag("products");
  }

  return (
    <>
      <Content productList={products} />
      <ProductsPagination searchResultCount={count} refetchProducts={refetchProducts} /> 
    </>    
  )
}