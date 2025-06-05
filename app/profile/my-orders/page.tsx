import { headers } from "next/headers";
import SidePanel from "../side-panel";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/db";
import { Order } from "@/lib/generated/prisma";
import Image from "next/image";

export default async function MyOrders() {
  const currency = process.env.CURRENCY || '$';
  const session = await auth.api.getSession({
      headers: await headers()
  })

  if (!session) {
    return <div className="m-48 text-center">Please sign in to view your orders.<br/><br/>
      <Link href="/sign-in"><Button>Sign In</Button></Link>
    </div>;
  } 

  const orders = await getOrders(session.user.id) as Order[];

 
  const itemDescription = (items: any) => {

    // return Object.entries(items).map(([key, item]: [string, any]) => {
    //   const { name, offerPrice, quantity, amount } = item;
    //   return `${name}  ${offerPrice} x ${quantity} - ${amount}`;
    // }).join(', ');
    return (
      <div className="flex flex-col">
        {Object.entries(items).map(([key, item]: [string, any]) => {
          const {productId, name, offerPrice, quantity, amount, image } = item;
          
          return (
            <div key={key} className="flex justify-between items-center">               
              <span><Link href={`/products/${productId}`}><Image src={image} width={50} height={50} alt={name}  /></Link></span>
              <span>{name}</span>
              {
                quantity > 1 ? <span>{currency}{offerPrice} x {quantity} - {currency}{amount}</span>
                : <span>{currency}{offerPrice}</span>
              }
            </div>
          );
        })}
      </div>
    )
    
  }


  return (
    <SidePanel>
         <div className="no-scrollbar flex-1 flex flex-col justify-between">
           <div className="w-full md:p-10 p-4">
             <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
               <table className="md:table-auto table-fixed w-full overflow-hidden table-list">
                 <thead>
                   <tr>
                       <th className="">Description</th>
                       <th>Amount</th>
                       <th>Payment</th>
                       <th>Date</th>
                   </tr>
                 </thead>
                 <tbody>
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-100/90">
                        <td ><div className="w-full mb-2">Order Id: {order.id}</div>{itemDescription (order.items)}</td>
                        <td className="text-center">{currency}{order.amount} </td>
                        <td className="text-center">{order.paymentType}</td>
                        <td className="text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No orders found.</td>
                      </tr>
                    )}  
                 
                 </tbody>
               </table>	
             </div>
           </div>
         </div>
         
       </SidePanel>
  )
}