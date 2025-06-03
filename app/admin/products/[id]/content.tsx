"use client";
import { useToast } from "@/hooks/use-toast";
import React, { useActionState, useEffect, useRef, useState } from "react";
import SidePanel from "../../side-panel";
import { Product } from "@/lib/generated/prisma";
import { assets } from "@/assets/assets";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormField } from "@/components/ui/input-form-field";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/loading-button";
import { formProduct, uploadFile } from "./product-actions";
import { productFormSchemaFE, type ProductFormSchemaFE } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Resizer from "react-image-file-resizer";


export default function Content({product, isAddProduct = false}:{product: Product | null, isAddProduct: boolean}) {
  // console.log('product: ', product)
  const { toast } = useToast();
  const router = useRouter();
  const initialState = {
    success: false,
    message: '',
    error: {},
    addedProductId: ''
  }
  const initialUploadState = {
    success: false,
    message: '',
    uploadedUrl: [],
  }

  const [state, action, isPending] = useActionState(formProduct, initialState);
  const [ stateUpload, actionUpload, isUploading ] = useActionState(uploadFile,initialUploadState);
  const [prodImages, setProdImages ] = useState(product && product?.images || [])
  const [isReplaceImage, setIsReplaceImage] = useState(false); //false means add image.
  const [imageIndex, setImageIndex] = useState(-1);
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [prodImagesObj, setProdImagesObj] = useState("")
  const formRef = useRef(null);
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormSchemaFE, string[]>>>({});

  const form = useForm<ProductFormSchemaFE>({
      resolver: zodResolver(productFormSchemaFE),
      defaultValues: isAddProduct ? {
        name: "",
        brand: "",
        description: "",
        inStock: String(product?.inStock ? "true" : "false"),
        price: "1",
        offerPrice: "0",
        quantity: "1",
        tags: "",
      } : {
        name: product?.name ?? "",
        brand: product?.brand ?? "",
        description: product?.name ?? "",
        inStock: String(product?.inStock ? "true" : "false"),
        price: String(product?.price ?? "0"),
        offerPrice: String(product?.offerPrice ?? "0"),
        quantity: String(product?.quantity ?? "1"),
        tags: product?.tags ?? "",
      },
    });

  async function processSubmitMultiple (files:any, limit:number = 5) {    
    var resizedFiles: File[] = [];
    for (const file of files) {  
        let img = await imgResizer(file);
        if (img.size <= 1.0 * 1024 * 1024) {
           resizedFiles.push(img);
        } else {
          toast({
            title: "Error",
            description: "Upload file was too large to handle. Please limit to 2 mb file size  " ,
            variant: "destructive"
          });
        }
    }

   
    React.startTransition(() => {
      let formData = new FormData();
      resizedFiles.forEach(f => {
        formData.append("files", f);
      });
     
      actionUpload(formData);
    });
     
  }

  function imgResizer(file: File): Promise<File> {
    try {
      return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
          file, 1000, 1000, "JPEG", 90, 0,
          (uri:any) => {
            resolve(uri);
          },
          "file"
        );
      });
    } catch (err) {
      console.log(err);
      return Promise.reject(new Error("An error occurred during image resizing"));
    }
  }
  

  function deletePrevProdImage(index: number) {
    const updatedImages = [...prodImages];
    updatedImages.splice(index, 1);
    setProdImages(updatedImages);
    setProdImagesObj(JSON.stringify(updatedImages)); //update the  object that will be sent in save form.
  }

  useEffect (() => {
    if(stateUpload.uploadedUrl.length) {
      console.log("upload-stateUpload?.uploadedUrl: ", stateUpload?.uploadedUrl)
      if (isReplaceImage) {
        setProdImages((prev) => {
          const updatedImages = [...prev];
          updatedImages[imageIndex] = stateUpload.uploadedUrl[0];
          setProdImagesObj(JSON.stringify(updatedImages))
          return updatedImages;
        });
      } else {
        setProdImages((prev) => {
          const updatedImages = [...prev];
          stateUpload.uploadedUrl.map(url => {
            updatedImages.push(url);
          })
          setProdImagesObj(JSON.stringify(updatedImages))
          return updatedImages;
        }); 
      }
           
      
      setIsReplaceImage(false)
      setImageIndex(-1)
      setIsImageUploading(false)
      toast({
        title: "Success",
        description: "Successfully uploaded",
        variant: "default",
      });
    }
  }, [stateUpload])

  useEffect(() => {
    // console.log('state: ', state)
    if(isAddProduct && state.success) {
      toast({
        title: "Success",
        description: "Successfully Added",
        variant: "default",
      });
      // console.log('state: ', state)
      router.push("/admin/product-list")
    } else if (state.success) {
      toast({
        title: "Success",
        description: "Successfully Updated",
        variant: "default",
      });
      setFormErrors({})
    }
    
  }, [state])
 

  function formAction (formData: FormData) {
    // console.log('formAction')
    // setProdImagesObj(JSON.stringify(prodImages))
    let formValues = Object.fromEntries(formData);
    const validatedData = productFormSchemaFE.safeParse(formValues);

    if (!validatedData.success) {
      setFormErrors(validatedData.error.flatten().fieldErrors);        
    } else {
      React.startTransition(() => {
        action(formData);
      });
    }

  }

  return (
    <SidePanel>
      <div className="no-scrollbar flex-1 dvh  flex flex-col justify-between">
        { product === null && isAddProduct === false ?
          <div className="mx-10 my-10">Product not found <br/><Button onClick={()=>router.back()} className="mt-4">Back</Button></div> 
        :
        <div>
        <Form {...form}>  
        <form action={formAction} className="p-8 space-y-5">
          <Input type="hidden" name="id" value={product ? product.id : ""} /> 
          <Input type="hidden" name="images" value={prodImagesObj ?? ""} /> 
          <Input type="hidden" name="inStock" value={product?.inStock ? "true" : "false"} /> 
          <Input type="hidden" name="quantity" value={product?.quantity ? product?.quantity.toString() : "1"} /> 
          <Input type="hidden" name="isAddProduct" value={isAddProduct ? "true" : "false"} /> 
          <Input type="hidden" name="isDeleteForm" value={isDeleteForm ? "true" : "false"} /> 
          
          <p className="text-base font-medium">Product Image</p>
          <div className={'flex flex-wrap items-center gap-3 mt-2 ' + (isUploading ? ' opacity-25 cursor-none ' : '')} >
              {prodImages && prodImages.map((img, index) => (
                  <label key={index} htmlFor={`image${index}`} className="relative prev-image-upload">
                      <input 
                        onChange={(event) => {
                          if (event.target.files) {
                            setIsImageUploading(true)
                            setIsReplaceImage(true)
                            processSubmitMultiple(event.currentTarget.files, 1)
                            setImageIndex(index)
                          }
                        }}
                        type="file" 
                        id={`image${index}`} 
                        hidden
                        accept="image/*"                        
                      />
                      <Image 
                        className="max-w-24 cursor-pointer " 
                        src={img}
                        alt="uploadArea" width={100} height={100}
                      />
                      <button type="button" onClick={()=> deletePrevProdImage(index)} className="cursor-pointer mx-auto ">
                          <Image src={assets.remove_icon} alt="remove" className="absolute top-0 right-0 w-5 h-5 delete-icon"  />
                      </button>
                  </label>
              ))}
              {prodImages.length < 5 &&  
                <label>
                    <input 
                      onChange={(event) => {processSubmitMultiple(event.currentTarget.files, 5 - prodImages.length)}}
                      type="file" 
                      hidden
                      multiple
                      accept="image/jpeg,image/gif,image/png,image/webp"
                    />
                    <Image 
                      className="max-w-24 cursor-pointer" 
                      src={assets.upload_area.src}
                      alt="uploadArea" width={100} height={100}
                    />
                </label>
            }
          </div>
          
          <InputFormField
            name="name"
            label="Name"
            placeholder=""
            containerClassName="w-1/2"
            description={formErrors?.name && (
              <span className="text-sm text-red-500">
                {formErrors.name[0]}
              </span>
            )}
            formControl={form.control}
          />
        
          <InputFormField
            name="brand"
            label="Brand"
            placeholder=""
            containerClassName="w-1/2"
            formControl={form.control}
            description={formErrors?.brand && (
              <span className="text-sm text-red-500">
                {formErrors.brand[0]}
              </span>
            )}            
          />

          <InputFormField
            name="description"
            label="Description"
            placeholder=""
            containerClassName="w-1/2"
            description=""            
            formControl={form.control}
          />
          <InputFormField
            name="category"
            label="Category"
            placeholder=""
            containerClassName="w-1/2"
            description=""
            formControl={form.control}
          />
          <InputFormField
            name="price"
            label="Price"
            placeholder=""
            inputType="number"
            containerClassName="w-1/2"
            formControl={form.control}
            description={formErrors?.price && (
              <span className="text-sm text-red-500">
                {formErrors.price[0]}
              </span>
            )}            
          />
          
          <InputFormField
            name="offerPrice"
            label="Offer Price"
            placeholder=""
            inputType="number"
            containerClassName="w-1/2"
            formControl={form.control}
          />

          <InputFormField
            name="tags"
            label="Tags"
            placeholder=""
            containerClassName="w-1/2"
            description=""
            formControl={form.control}
          />
          <div>
            <LoadingButton pending={isPending} className="w-32 px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer"> Save</LoadingButton>            
            <Button type="button" variant="secondary" className="ml-4" onClick={()=>router.back()} >Cancel</Button>        
          </div>
        </form>
        </Form> 
        </div>
        }
      </div>
    </SidePanel>  
    
  )
}
