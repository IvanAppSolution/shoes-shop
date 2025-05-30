
import { getProduct } from "@/lib/db";
import { Product } from "@/lib/generated/prisma";
import Content from "./content";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/lib/search-params";
import RelatedProducts from "./related-products";
import { Suspense } from "react";
 
type PageProps = {
  params: Promise<{id: string}>
}

// type Props = {
//   params: Promise<{id: string}>
// }
// type PageProps = {
//   searchParams: Promise<SearchParams>
// }

export default async function ProductDetails({params}: PageProps) { 
  const { id } = await params
    const product = getProduct(id);
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Content productPromise={product}  />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <RelatedProducts productId={id} />
        </Suspense>
      </div>
    )
    
};
