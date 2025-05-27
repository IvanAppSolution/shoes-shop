"use client";
import { AppContext }  from "@/components/context";
import BestSeller from "./best-seller";
import Categories from "./categories";
import MainBanner from "./main-banner";
import { Product } from "@/lib/generated/prisma";
import NewsLetter from "./news-letter";
import { useContext, useEffect } from "react";


export default function Content () {
  const {setProducts, cartItems} = useContext(AppContext);
  
  async function getBestSellerProducts() {
    const data = await fetch(`/api/products/getBestSellerProducts`)
    const products:Product[] = await data.json()
    if (products.length) {
        setProducts(products);  
    }
  }

  useEffect(() => {
    getBestSellerProducts()       
  }, []);
 
  return (
    <div className="mt-12">
      <MainBanner /> 
      <Categories /> 
      <BestSeller />
      <NewsLetter /> 
    </div>
    
  )
 
}