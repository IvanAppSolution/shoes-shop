"use client";
import React, { useContext, useEffect, useState } from "react";
import { assets, brands } from '../../assets/assets'
import { useRouter } from "next/navigation";
import { Product } from "@/lib/generated/prisma";
import Image from "next/image";
import { AppContext } from "../context";
import Link from "next/link";

interface ProductCardProps {
  product: Product,
}

export default function ProductCard ({product}: ProductCardProps) {
    const {addToCart, currency} = useContext(AppContext);
    const router = useRouter();
    const [rating, setRating] = useState(1)

    function getLogo (findBrand: string | null) {
        if (findBrand)
            return brands.find(brand => brand.text.toLocaleLowerCase() === findBrand.toLocaleLowerCase())?.tinyImage
        else return null;
    }

    function getRandom () {
        const rating = [2,3,4,5]
        return rating[Math.floor(Math.random() * rating.length)];
    }

    useEffect(() => {
        setRating(getRandom())
    }, []);
   
    return product && (
        <div className="border border-gray-500/20 rounded-md md:px-4 px-2 py-2 bg-white min-w-48 max-w-56 w-full relative">
            <div className="group cursor-pointer flex items-center justify-center px-2 overflow-hidden" style={{height:"150px"}}>
                <Link href={`/products/${product.id}`}>
                    <Image className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.images[0] ?? "/images/empty.png"} alt={product.name} height="150" width="150"  />
                </Link>
            </div>
            <div className="text-gray-500/60 text-sm ">
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                { product.brand ? <Image src={getLogo(product.brand) ?? "/images/empty_tiny.png"} width={30} height={30} alt={`${product.brand}`} className="absolute top-2 left-2" /> : false}
                <div className="flex items-center gap-0.5 mt-1">
                    {Array(5).fill('').map((_, i) => (
                         <Image  key={i} className="md:w-3.5 w3" src={i < rating ? assets.star_icon : assets.star_dull_icon} alt="rating" width="10" height="10"   />
                    ))}
                    <p>({rating})</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice} {product.price > 0 ? <span className="text-gray-500/60 md:text-xs text-xs line-through">{currency}{product.price}</span> : ""}
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer" onClick={() => addToCart(product.id)} >
                            <Image src={assets.cart_icon} alt="cart_icon" height="0" width="0" />
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
