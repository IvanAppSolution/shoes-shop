"use client";
import React from 'react'
import { brands } from '../../assets/assets'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function Categories() {
  const router = useRouter();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Brands</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {brands.map((brand, index)=>(
            <div key={index} className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
              onClick={()=>{
              router.push(`/products?brand=${brand.path}`);                 
            }}
            >
                <Image src={brand.image.src} width={100} height={100} style={{ width: "auto", height: "auto" }} alt={brand.text} className='group-hover:scale-108 transition max-w-28'/>                
            </div>  
        ))}
        
      </div>
    </div>
  )
} 
