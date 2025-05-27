"use client";
import { AppContext } from "@/components/context";
import { Product } from "@/lib/generated/prisma"
import React, { useActionState, useContext, useEffect, useState } from "react"
import SidePanel from "../side-panel";
import { useRouter } from "next/navigation";
import { updateProductStock, deleteProduct } from "../product/[id]/product-actions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductsFilter from "@/components/ui/products-filter";
import { assets } from "@/assets/assets";
import Image from "next/image";
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

interface ProductsPaginationProps {
    productList: Product[]|[];
  }

export default function Content({productList}: ProductsPaginationProps) {
//   console.log('productList length: ', productList.length)  
  const [products, setProducts] = useState<Product[]>([]); //<Product[] | []> useState(productList)
  const { currency} = useContext(AppContext);
  const router = useRouter();
  const initialState = {
    success: false,
    message: '',
    error: {}
  }
  const initialState2 = {
    success: false,
    message: '',
    error: {}
  }
  const [state, action, isPending] = useActionState(updateProductStock, initialState);
  const [state2, actionDelete] = useActionState(deleteProduct, initialState2);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  async function toggleStock (id: string, inStock: boolean) {
      try {
            const form = new FormData();
            form.append('id', id);
            form.append('inStock', inStock ? 'true' : 'false');

            React.startTransition(async () => {
                const result = await action(form);
                console.log("result: ", result);
            
                toast({
                title: "Successfully updated",
                description: <p style={{ whiteSpace: "pre-line" }}>{"Product updated. \n Product can now be seen in the product list. "}</p>,
                variant: "default",
                });
            
                // Update the `inStock` property of the product with the given `id`
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === id ? { ...product, inStock } : product
                    )
                );
            });
      } catch (error) {
          toast({
            title: "Error",
            description: "Error while updating!",
            variant: "destructive"
          })
      }
  }

  async function submitDeleteProduct (id: string) {
    try {
        const form = new FormData();
        form.append('id', id);

        React.startTransition(async () => {
            const result = await actionDelete(form);
            console.log("result: ", result);
        
            toast({
                title: "Successfully deleted",
                variant: "default",
            });
        
            // Update the `inStock` property of the product with the given `id`
            setProducts((prevProducts) =>
                prevProducts.filter((product) =>
                    product.id !== id 
                )
            );
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Error while updating!",
            variant: "destructive"
        })
    }
  }

  

  function openDeleteDialog(id: string) {
    setSelectedProduct(
        products.find(p => p.id === id) || null
    )
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  }
  
  function closeDeleteDialog() {
    setSelectedProduct(null);
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  }

  useEffect(() => {
    setProducts(productList)
  }, [productList])

  return (
    <SidePanel>
      <div className="no-scrollbar flex-1 flex flex-col justify-between">
          <div className="w-full md:p-10 p-4">
                <div className="relative h-12">
                    <ProductsFilter className="absolute left-0" />
                    <Button className="w-32 absolute right-0 cursor-pointer" onClick={()=>router.push("/admin/product/add")} >Add Product</Button>
                </div>
                
              <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                  <table className="md:table-auto table-fixed w-full overflow-hidden">
                      <thead className="text-gray-900 text-sm text-left">
                          <tr>
                              <th className="px-4 py-3 font-semibold truncate">Product</th>
                              <th className="px-4 py-3 font-semibold truncate">Brand</th>
                              <th className="px-4 py-3 font-semibold truncate hidden md:block">Price</th>
                              <th className="px-2 py-3 font-semibold truncate">In Stock</th>
                              <th className="px-2 py-3 font-semibold truncate">Action</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm text-gray-500">
                          {products.map((product) => (
                              <tr key={product.id} className="border-t border-gray-500/20 cursor-pointer" >
                                  <td onClick={()=>router.push("/admin/product/"+product.id)} className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                      <div className="p-2">
                                          <img src={product.images[0] ?? "/images/empty.png"} alt="Product" className="w-16" />
                                      </div>
                                      <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                  </td>
                                  <td className="px-4 py-3">{product.brand}</td>
                                  <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                  <td className="px-4 py-3">
                                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                          <input onChange={()=> toggleStock(product.id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                                          <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                          <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                      </label>
                                  </td>
                                  <td className="px-4 py-3">
                                    <button onClick={()=> openDeleteDialog(product.id)} className="cursor-pointer mx-auto">
                                        <Image src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6"  />
                                    </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
            {/* You can leave this empty, since you control open state manually */}
            <span />
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
                <div className="flex justify-start">
                    <Image  src={selectedProduct?.images[0] ?? "/images/empty.png"} className="w-24 m-4" width="200" height="200"  alt="Product"/>
                    <div className="mt-4">
                        <div className="font-bold">{selectedProduct?.name}</div>
                        <div>{selectedProduct?.brand}</div>
                        <div>{currency}{selectedProduct?.offerPrice}</div>
                    </div>
                </div>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                if (selectedProductId) submitDeleteProduct(selectedProductId);
                    closeDeleteDialog();
                }}
            >
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </SidePanel>
  )
}