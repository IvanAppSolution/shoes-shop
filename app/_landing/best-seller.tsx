import ProductCard from '@/components/ui/product-card';
import { Product } from '@/lib/generated/prisma';
import { getBestSellerProducts } from '@/lib/db';
import { shuffleArray } from '@/lib/utils';

export default async function BestSeller () {
  const products = await getBestSellerProducts();

  return (
        <div className='mt-16'>
          <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p> 
          
          <div className='grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 mt-6'>   
            {products.length ? shuffleArray(products).filter((product: Product)=> product.inStock).map((product) =>  (
              <ProductCard key={product.id} product={product} />
            )) : false}        
          </div>
        </div>   
  )
}

