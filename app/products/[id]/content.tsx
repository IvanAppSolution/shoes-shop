"use client";
import { useContext, useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/generated/prisma";
import Link from "next/link";
import { AppContext } from "@/components/context";
import RelatedProducts from "./related-products";

export default function Content({product}: {product: Product}) {
  const [thumbnail, setThumbnail] = useState('');
  const router = useRouter();
  const {addToCart, setViewProductId, currency} = useContext(AppContext);

  useEffect(()=>{
    setThumbnail(product?.images[0] ? product.images[0] : '')
    console.log('Product-product.id: ', product.id)
    setViewProductId(product.id)
  },[])
 
  
  return (
    <div className="mt-12">
            <p>
                <Link href={"/"}>Home</Link> /
                <Link href={"/products"}> Products</Link> /
                <Link href={`/products?search=${product.brand}`}> {product.brand}</Link> /
                <span className="text-primary"> {product.name}</span>
                <Link href={`/admin/product/${product.id}`}> Edit </Link>
            </p>


            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.images.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <Image src={image} alt={`Thumbnail ${index + 1}`} width="100" height="100" />
                            </div>
                        ))}
                    </div>

                    <div className="max-w-100 overflow-hidden">
                       { thumbnail ? <img src={thumbnail} alt="Selected product" width={400} height="auto" /> : null}
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                          <img key={i} src={i<4 ? assets.star_icon.src : assets.star_dull_icon.src} alt="star-icon" className="md:w-4 w-3.5" width="100" height="100"/>
                            //  <Image key={i} className="md:w-3.5 w3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" width="100" height="100"/>
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        {product.price ? <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p> : false}
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                      <li >{product.description}</li> 
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={()=> addToCart(product.id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={()=> {addToCart(product.id); router.push("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* ---------- related products -------------- */}
            <RelatedProducts />
        </div>
  )
}