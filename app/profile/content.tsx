"use client";
import SidePanel from "./side-panel";
import React, { use, useActionState, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormField } from "@/components/ui/input-form-field";
import { Address, User } from "@/lib/generated/prisma";
import { phoneNumber } from "better-auth/plugins";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { updateUserInfo } from "./profile-action";
import { useRouter } from "next/navigation";
import { UserFormSchema, userFormSchema } from "@/types/user";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


interface ContentProps {
  userPromise: Promise<User | null>;
  addressPromise: Promise<Address | null> | undefined;
}

const initialState = {
  success: false,
  message: '',
  error: {},
}

export default function Content({userPromise, addressPromise}:ContentProps) {
  const user = use(userPromise);
  const { toast } = useToast();
  const address = addressPromise ? use(addressPromise) : null;
  const router = useRouter();
  const [state, action, isPending] = useActionState(updateUserInfo, initialState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormSchema, string[]>>>({});
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      state: address?.state || "",
      city: address?.city || "",
      street: address?.street || "",
      zipcode: address?.zipcode || "",
      phone: address?.phone || "",
    },
  });

  const fetchOrders = async () => {
    // Fetch orders logic here
  };


  function formAction (formData: FormData) {
    console.log('formAction', formData)
    let formValues = Object.fromEntries(formData);
    console.log('formValues', formValues)
    const validatedData = userFormSchema.safeParse(formValues);

    if (!validatedData.success) {
      console.log('form error')
      setFormErrors(validatedData.error.flatten().fieldErrors);        
    } else {
      console.log('form submit')
      React.startTransition(() => {
        action(formData);
      });
    }
  }

  useEffect(() => {
      if(state.success) {
        toast({
          title: "Success",
          description: "Successfully updated profile",
          variant: "default",
        });
        setFormErrors({})
      } 
      
    }, [state])

  return (
    <SidePanel>
      <div className="w-96 md:p-10">
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <Input type="hidden" name="userId" value={user?.id} /> 
            <Input type="hidden" name="addressId" value={address?.id} /> 
            <InputFormField
              name="name"
              label="Name"
              placeholder="Name"
              inputType="name"
              formControl={form.control}
              description={formErrors?.name && (
                <span className="text-sm text-red-500">
                  {formErrors.name[0]}
                </span>
              )}
            />
          
            <InputFormField
              name="email"
              label="Email"
              placeholder="Email"
              inputType="email"
              formControl={form.control}
              description={formErrors?.email && (
                <span className="text-sm text-red-500">
                  {formErrors.email[0]}
                </span>
              )}
            />

            <InputFormField
              name="phone"
              label="Phone Number"
              placeholder="Phone Number"
              inputType="text"
              formControl={form.control}
            /> 

            <InputFormField
              name="state"
              label="State"
              placeholder="State"
              inputType="text"
              formControl={form.control}
            />
            <InputFormField
              name="city"
              label="City"
              placeholder="City"
              inputType="text"
              formControl={form.control}
            />
            <InputFormField
              name="street"
              label="Street"
              placeholder="Street"
              inputType="text"
              formControl={form.control}
            />
            <InputFormField
              name="zipcode"
              label="Zip Code"
              placeholder="Zip Code"
              inputType="text"
              formControl={form.control}
            /> 
          
            <div>
              <LoadingButton pending={isPending} className="w-32 px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer"> Save</LoadingButton>            
              <Button type="button" variant="secondary" className="ml-4" onClick={()=>router.back()} >Cancel</Button>        
            </div>
 
          </form>
        </Form>
      </div>
    </SidePanel>
  );

}