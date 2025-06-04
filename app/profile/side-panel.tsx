"use client";
import { useRouter, usePathname  } from "next/navigation";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { ReactNode } from "react";

export default function SidePanel({children}:{children: ReactNode}) {
	const router = useRouter();
  const pathname = usePathname()
  
	const sidebarLinks = [
      // { name: "Add Product", path: "/admin/add-product", icon: assets.add_icon },
      { name: "Profile", path: "/profile", icon: assets.product_list_icon },
      { name: "My Orders", path: "/profile/my-orders", icon: assets.order_icon },
  ];

  return (
    <div className="flex">
      <div className="md:w-48 border-r  text-base border-gray-300 pt-4 flex flex-col">
        {sidebarLinks.map((item) => (
            <Link href={item.path} key={item.name} className={`flex items-center py-3 px-4 gap-3 
              ${(pathname === item.path ) ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                  : "hover:bg-gray-100/90 border-white"
              }`}>
                <img src={item.icon.src} alt="" className="w-7 h-7" />
                <p className="md:block hidden text-center">{item.name}</p>
                
            </Link>
        ))}
      </div>
      {children}
    </div>
  )
}