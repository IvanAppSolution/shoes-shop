
import { getProduct } from "@/lib/db";
import { Product } from "@/lib/generated/prisma";
import Content from "./content";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/lib/search-params";
 
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
    console.log('ProductDetails-id: ', id)
    const product:Product | null = await getProduct(id);
    return product ? <Content product={product}  /> : <p>Loading..</p>;
};
