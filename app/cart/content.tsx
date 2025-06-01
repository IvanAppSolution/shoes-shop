
"use client";
import React, { use, useActionState, useContext, useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { AppContext } from "@/components/context";
import { toast } from "@/hooks/use-toast";
import { Address, Product } from "@/lib/generated/prisma";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { checkoutAction } from "./checkout-action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export default function Content({productsPromise}: { productsPromise: Promise<Product[]> } ) {   
    const {user, isLoaded, cartItems, getCartCount, currency, updateCartItem, subtractFromCart, emptyCart} = useContext(AppContext);
    const [products, setProducts] = useState<Product[]>(use(productsPromise) || []); //<Product[] | []> useState(productList)
    const [addresses, setAddresses] = useState<Address[] | []>([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined)
    const [paymentOption, setPaymentOption] = useState("online payment")
    const [totalAmount, setTotalAmount] = useState(0)
    const [dialogOpen, setDialogOpen] = useState(false)
    
    const router = useRouter();
    const initialState = {
        success: false,
        message: '',
        url: '',
        paymentOption: ''
      }
    const [state, action, isPending] = useActionState(checkoutAction, initialState);
 

    function adjustCartInfo() {
        let totalAmount = 0;
        const updateProducts = products.filter(product => cartItems.hasOwnProperty(product.id))
        
        updateProducts.map((item: any)=>{
                item.quantity = cartItems[item.id];
                item.amount = cartItems[item.id] * item.offerPrice;
                totalAmount += cartItems[item.id] * item.offerPrice;
        })

        setProducts(updateProducts);
        setTotalAmount(totalAmount);
    }

    const getUserAddress = async () => {
        try {
            const data = await fetch(`/api/cart/getUserAddress/${user ? user.id : ''}`)
            const address = await data.json()
            
            if (address.length) {
                setAddresses(address)
                delete address[0].id
                delete address[0].userId
                setSelectedAddress(address[0])
            }
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    const placeOrder = async ()=>{
        try {
            if(!selectedAddress){
                return toast({
                    title: "Shipping address",
                    description: "Please select an address",
                    variant: "destructive",
                })
            }
 
            const items = products.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    offerPrice: item.offerPrice,
                    quantity: item.quantity,
                    amount: item.amount
                }
            })


            let formData = new FormData();
            formData.append("userId", user.id);
            formData.append("totalAmount", totalAmount.toString());
            formData.append("items", JSON.stringify(items));
            formData.append("address", JSON.stringify(selectedAddress));
 
            if(paymentOption === "COD"){
                formData.append("paymentOption", "COD");
            }else{               
                formData.append("paymentOption", "online payment");
            }

            React.startTransition(async () => {
                action(formData);
            });
            
        } catch (error) {
            toast({
                title: "Error",
                description: String(error),
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        console.log('cart-user: ',user)
        console.log('cart-products: ',products)
        console.log('cart-isLoaded: ',isLoaded)
        if (user) getUserAddress();  
        if (isLoaded && !user) {
            setDialogOpen(true);
        }  
    }, [])

    useEffect(() => {        
        adjustCartInfo()
    }, [cartItems])

    useEffect(() => {
        if (state.success && state.paymentOption === "COD") {
            toast({
                title: "Order placed successfully",
                description: "Your order will be delivered soon.",
                variant: "default"
            })
            emptyCart();
            router.push("/success");
        } else if (state.success && state.paymentOption === "online payment") {
            window.location.replace(state.url)
        }
            
    }, [state])
    

  return (
    <div>
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 min-w-m max-w-4xl'>
            <h1 className="text-3xl font-medium mb-6">
                Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
            </h1>

            <div className="grid grid-cols-[3fr_1fr] text-gray-500 text-base font-medium pb-3">
                <p className="text-left">Product Details</p>
                <p className="text-center">Sub total</p>
            </div>

            { products.map((product, index) => (
                <div key={index} className="grid grid-cols-[3fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                    <div className="flex items-center md:gap-6 gap-3">
                        <div onClick={()=>{
                            router.push(`/products/${product.category}/${product.id}`); scrollTo(0,0)
                        }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                            <Image className="max-w-full h-full object-cover" src={product.images[0]} alt={product.name} height="140" width="140" />
                        </div>
                        <div>
                            <p className="hidden md:block">{product.name}</p>
                            <div className="font-normal text-gray-500/70">
                                <div className='flex items-center'>
                                    <div className="text-sm flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                        <button onClick={() => {subtractFromCart(product.id)}} className="cursor-pointer text-md px-2 h-full" >
                                            -
                                        </button>
                                        <span className="w-5 text-center">{cartItems ? cartItems[product.id] : null}</span>
                                        <button onClick={() => {updateCartItem(product.id, 1)}} className="cursor-pointer text-md px-2 h-full" >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* <div onClick={()=> removeFromCart(product.id)} className="text-sm text-red-300 cursor-pointer"><span>Delete</span></div> */}
                        </div>
                    </div>
                    <p className="text-center">{currency}{(product.offerPrice) * (product.quantity ?? 0)}</p>
                </div>)
            )}

            <button onClick={()=> {router.push("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                <Image className="group-hover:-translate-x-1 transition"  src={assets.arrow_right_icon_colored} alt="arrow" height="0" width="0" style={{ width: '15', height: 'auto' }} />
                Continue Shopping
            </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
            <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
            <hr className="border-gray-300 my-5" />

            <div className="mb-6">
                <p className="text-sm font-medium uppercase">Delivery Address</p>
                <div className="relative flex justify-between items-start mt-2">
                    <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                    <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                        Change
                    </button>
                    {showAddress && (
                        <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                            {addresses.map((address, index)=>(
                            <p key={index} onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                {address.street}, {address.city}, {address.state}, {address.country}
                            </p>
                        )) }
                            <p onClick={() => router.push("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                Add address
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                <select value="online payment" onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="online payment">Online Payment</option>
                        <option value="COD">Cash On Delivery</option>
                </select>
            </div>

            <hr className="border-gray-300" />

            <div className="text-gray-500 mt-4 space-y-2">
                <p className="flex justify-between">
                    <span>Price</span><span>{currency}{Math.floor(totalAmount).toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                    <span>Shipping Fee</span><span className="text-green-600">Free</span>
                </p>
                <p className="flex justify-between">
                    {/* <span>Tax (10%)</span><span>{currency}{totalAmount * 2 / 100}</span> */}
                </p>
                <p className="flex justify-between text-lg font-medium mt-3">
                    <span>Total Amount:</span><span>
                        {currency}{Math.floor(totalAmount).toFixed(2)}</span>
                </p>
            </div>

            <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
            </button>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <div className=""  >
            <div className="m-2 italic">--------- Note: Use this test account to pay ---------</div>
            <Image src={assets.samplePayment} alt="sample payment" width={393} height={100}   />
        </div>    
      </div>
        <AlertDialog open={dialogOpen} onOpenChange={()=>setDialogOpen(false)}>
            <AlertDialogTrigger asChild>
                {/* You can leave this empty, since you control open state manually */}
                <span />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Authentication Required</AlertDialogTitle>
                <AlertDialogDescription>
                    <span className="flex justify-start">
                         Please login to continue? 
                    </span>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction  onClick={() => { router.push("/sign-in"); }}> Login </AlertDialogAction>
                <AlertDialogCancel onClick={() => { router.push("/"); }}> Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      
  </div>
  )
}