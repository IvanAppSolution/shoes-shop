"use client";
import React, { useContext, useEffect, useState } from 'react'
import ProductCard from '@/components/ui/product-card';
import { AppContext } from '@/components/context';
import { Product } from '@/lib/generated/prisma';

export default function BestSeller () {
  const { getBestSellerProducts, shuffleArray } = useContext(AppContext);
  const [products, setProducts ] = useState<Product[]>([])
 
  async function getProducts() {
    
      try {
        const _products: Product[] = await getBestSellerProducts();        
        setProducts(shuffleArray(_products));
      } catch (error) {
        console.error("Error fetching related products: ", error);
      }
     
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
        <div className='mt-16'>
          <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p> 
          
          <div className='grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 mt-6'>   
            {products ? products.filter((product: Product)=> product.inStock).map((product) =>  (
              <ProductCard key={product.id} product={product} />
            )) : false}        
          </div>
        </div>   
  )
}

