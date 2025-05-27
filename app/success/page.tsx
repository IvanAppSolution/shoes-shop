"use client";
import { AppContext } from "@/components/context";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CircleCheckIcon } from "lucide-react"
import Link from "next/link"
import { useContext, useEffect } from "react"

export default function SuccessPayment() {
const { emptyCart, cartItems} = useContext(AppContext);
  useEffect(()=>{
    if (Object.keys(cartItems).length) {
      emptyCart()
    }
  },[cartItems]) 

    return (
      <div className="flex flex-col items-center justify-center mt-32 ">
        <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <CircleCheckIcon className="text-green-500  w-16" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">Payment Successful</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Thank you for your shopping with us. Your order is being processed.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Link
                href="/"
                prefetch={false}
              >
                <Button> Continue Shopping</Button>
            </Link>
          </div>  
        </Card>
      </div>
  )
}