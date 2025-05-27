import React from 'react';
import { SearchParams } from 'nuqs';
import { Product } from '@/lib/generated/prisma';
import { getProducts } from '@/lib/db';
import Content from './content';
import ProductsPagination from '@/components/ui/products-pagination';
import { revalidateTag } from "next/cache";
import { shuffleArray } from '@/lib/utils';
import { loadSearchParams } from '@/lib/search-params';

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Products ({searchParams}: PageProps) {
  const { search, brand, perPage, offset } = await loadSearchParams(searchParams)
  const [products, count] = await getProducts({search, brand, perPage, offset}) as [Product[] | [], number];

  async function refetchProducts() {
    "use server";
    revalidateTag("products");
  }

  return (
    <>
      <Content products={products} />
      <ProductsPagination  searchResultCount={count} refetchProducts={refetchProducts} />
    </>
  )
}
