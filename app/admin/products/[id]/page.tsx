import { getProduct } from '@/lib/db';
import Content from './content';

type PageProps = {
    params: Promise<{id: string}>
}

export default async function ProductDetails({params}: PageProps) {
    const { id } = await params
    let isAddProduct = false;
    let product = null;

    if (id === "add") {
        isAddProduct = true;
    } else {
        product = await getProduct(id);
    }
    return (
        <Content product={product} isAddProduct={isAddProduct} />
    )
    
}

