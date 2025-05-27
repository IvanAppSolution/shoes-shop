"use client";
import { AppContext } from "@/components/context";
import { useContext, useEffect, useState } from "react";
import SidePanel from "./side-panel";

export default function Profile() {
  // const { currency} = useContext(AppContext);
  // const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
      // try {
      //     const { data } = await axios.get('/api/order/seller');
      //     if(data.success){
      //         setOrders(data.orders)
      //     }else{
      //         toast.error(data.message)
      //     }
      // } catch (error) {
      //     toast.error(error.message)
      // }
  };


  useEffect(()=>{
      fetchOrders();
  },[])

  return (
    <SidePanel>
      <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Profile</h2>
        </div>
      </div>
    </SidePanel>
  )
}