"use client";
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { assets } from '../assets/assets'
import { useTheme } from "next-themes";
import Link from 'next/link';
import Image from 'next/image';
import { User } from "@/lib/auth";
import { AppContext } from './context';
import { authClient } from '@/lib/auth-client';

export default function Header() {
 
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [open, setOpen] = useState(false)
  const {user, setUser, setShowUserLogin, getCartCount, getUserCartItems, setCartItems, cartItems, setIsLoaded, isLoaded} = useContext(AppContext);
  const [pending, setPending] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  async function initContext (user:User) {
    if (user) setUser(user)
    const cartItems = await getUserCartItems(user.id) as any
    setCartItems(cartItems)
    setIsLoaded(true)
  }

  const handleSignOut = async () => {
      try {
        setPending(true);
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/sign-in");
              router.refresh();
              setUser(null);
              setCartItems({});
              setIsLoaded(false);
            },
          },
        });
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        setPending(false);
      }
    };

  useEffect(() => {
    if (data) {
      initContext(data.user);
    } 
    
    if (isPending === false && data === null) {
      setIsLoaded(true);
    }
  }, [data, isPending])

  useEffect(() => {
    if (isLoaded === true && Object.keys(cartItems).length) {
      setCartCount(getCartCount());
    } else {
      setCartCount(0);  
    }
  }, [cartItems])

 

  return (
  <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300">

    <Link href='/' >
      <Image src={isDark ? "/images/logo-dark.png" : assets.logo.src} alt="Logo" onClick={() => router.push("/")} width={100} height={100} className="h-16 w-16 cursor-pointer" />
    </Link>

    <div className="hidden sm:flex items-center gap-8">
      <Link href='/'>Home</Link>
      <Link href='/products'>All Product</Link>

      <div onClick={()=> router.push("/cart")} className="relative cursor-pointer">
        <Image src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
        {cartCount ? <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{cartCount}</button> : ""}
      </div>

    {!user ? ( <Link href="/sign-in" className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">Sign In</Link>) :  
      (
        <div className='relative group'>
          <Image src={assets.profile_icon} className='w-10' alt="" />
          <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
            {user?.id ? <li onClick={()=>{router.push("/profile")}} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Hi, {user?.name}</li> : false}
            {user?.role === "admin" ? <li onClick={()=> router.push("/admin")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Admin</li> : false}
            <li onClick={()=> router.push("/profile/my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
            <li onClick={handleSignOut} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
          </ul>
        </div>
      )}
    </div>

    <div className='flex items-center gap-6 sm:hidden'>
          <div onClick={()=> router.push("/cart")} className="relative cursor-pointer">
              <img src={assets.nav_cart_icon.src} alt='cart' className='w-6 opacity-80'/>
              <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full"> </button>
            </div>
        <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
            <img  src={assets.menu_icon.src} alt='menu'/>
          </button>
    </div>
    

    { open && (
      <div className={`${open ? 'flex' : 'hidden'} absolute z-50 top-14.5 left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-4 px-5 md:hidden`}>
      <Link href="/" onClick={()=> setOpen(false)}>Home</Link>
      <Link href="/products" onClick={()=> setOpen(false)}>All Product</Link>
      {user && 
      <Link href="/products" onClick={()=> setOpen(false)}>My Orders</Link>
      }
      <Link href="/" onClick={()=> setOpen(false)}>Contact</Link>

      {!user ? (
        <button onClick={()=>{
          setOpen(false);
          setShowUserLogin(true);
        }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
        Login
      </button>
      ) : (
        <button onClick={handleSignOut} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
        Logout
      </button>
      )}
      
    </div>
    )}

  </nav>
  );

}