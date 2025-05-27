"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/lib/generated/prisma";
import { User } from "better-auth";

export const AppContext = createContext ({} as any);

export function AppContextProvider({children}  : { children: React.ReactNode}) {
  const [currency, setCurrency] = useState("$");
  const [user, setUser] = useState<User | undefined>(undefined)
  const [products, setProducts] = useState([] as Product[] | [])
  const [isSeller, setIsSeller] = useState(false)
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [viewProductId, setViewProductId] = useState("");
  const [defaultPerPage, setDefaultPerPage] = useState(30);
  
  const addToCart = (itemId: string) =>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }

    toast({
      title: "Success",
      description: "Added to Cart",
      variant: "default",
    });

    setCartItems(cartData);
    setIsLoaded(true)
  }

  const subtractFromCart = (itemId: string)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast({
      title: "Success",
      description: "Removed from Cart",
      variant: "default",
    });
    
    setCartItems(cartData)
    setIsLoaded(true)
  }

  const removeFromCart = (itemId: string)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        delete cartData[itemId];
    }
    toast({
      title: "Success",
      description: "Removed to Cart",
      variant: "default",
    });

    setCartItems(cartData)
    setIsLoaded(true)
  }

  const emptyCart = ()=>{
    // let cartData = structuredClone(cartItems);
    // cartData = {}
    setCartItems({})
  }

  const updateCartItem = (itemId: string, quantity: number)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] += quantity;
    setCartItems(cartData)
 
    toast({
      title: "Success",
      description: "Cart Updated",
      variant: "default",
    });
  }

  
  const updateCart = async () => {
    try {     
        const data = {
          userId: user ? user.id : '',
          cartItems: JSON.stringify(cartItems),
        }
        // console.log('updateCart data: ', data)
        const response = await fetch('/api/cart/updateUserCart', { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
   
        // console.log('updateCart response: ', response)
    } catch (error: any) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
    }
  }

  const getUserCartItems = async (userId: string): Promise<Record<string, number>> => {
    try {
      const data = await fetch(`/api/cart/getUserCartItems/${userId}`)
      const {cartItems} = await data.json()        
      // console.log('result: ', cartItems)
      return cartItems as Record<string, number>;
        
    } catch (error: any) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      return {};
    }
  }

  const getRelatedProducts = async (productId: string): Promise<Product[]> => {
    try {
      const data = await fetch(`/api/products/getRelatedProducts/${productId}`)
      const products = await data.json()        
      // console.log('result: ', products)
      return products as Product[];
        
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return [];
    }
  }

  const getBestSellerProducts = async (): Promise<Product[]> => {
    try {
      const data = await fetch(`/api/products/getBestSellerProducts`)
      const products = await data.json()        
      // console.log('getBestSellerProducts: ', products)
      return products as Product[];
        
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return [];
    }
  }

  

  const getCartCount = ():number => {
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount;
  }

  const shuffleArray = <T,>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  useEffect(() => {
    console.log('')
    if (isLoaded) {
      updateCart();
    }
    
  }, [cartItems])

  
 

  return <AppContext.Provider value={{
      user , setUser, 
      products, setProducts, 
      isSeller, setIsSeller, 
      showUserLogin, setShowUserLogin, 
      cartItems, setCartItems, 
      addToCart, subtractFromCart, removeFromCart,
      getUserCartItems, getCartCount, updateCartItem,
      isLoaded, setIsLoaded,
      viewProductId, setViewProductId,
      getRelatedProducts,
      getBestSellerProducts,
      shuffleArray,
      setCurrency, currency,
      setDefaultPerPage, defaultPerPage,
      emptyCart,
    }}> 
    {children}
  </AppContext.Provider>
}
 