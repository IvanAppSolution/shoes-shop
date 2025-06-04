"use client";
import { useEffect } from "react";
import SidePanel from "../side-panel";

export  default function Content() {
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
      <div className="no-scrollbar flex-1 flex flex-col justify-between">
        <div className="w-full md:p-10 p-4">
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden table-list">
              <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Date ordered</th>
                </tr>
              </thead>
              <tbody>
              
              </tbody>
            </table>	
          </div>
        </div>
      </div>
      
    </SidePanel>
);

}