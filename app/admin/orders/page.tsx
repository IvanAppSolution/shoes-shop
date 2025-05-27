"use client";
import { useEffect, useState } from "react";
import SidePanel from "../side-panel";

export default function Orders() {
  const [orders, setOrders] = useState([])
  const fetchOrders = async () => {

  };


  useEffect(()=>{
      fetchOrders();
  },[])

  return (
    <SidePanel>
      <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
        </div>
      </div>
    </SidePanel>
  )
}