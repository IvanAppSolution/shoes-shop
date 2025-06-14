"use server";
import { stripe } from "@/lib/stripe";
import {insertOrder} from "@/lib/db";

type ActionResponse = {
  success: boolean;
  message: string;
  url: string;
  paymentOption?: string;
}
export async function checkoutAction (
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {

  const userId = formData.get("userId") as string;
  const items = formData.get("items") ? JSON.parse(formData.get("items") as string) : null;
  const address = formData.get("address") as string;
  const totalAmount = formData.get("totalAmount") as string;
  const paymentOption = formData.get("paymentOption") as string;
   
  if (paymentOption === "online payment") {
    const line_items = items.map((product: any) => ({
      price_data: {
        currency: "usd",
        product_data: { productId: product.productId, name: product?.name, description: product?.description, image:product?.images[0] },
        unit_amount: parseFloat(product?.offerPrice) * 100,
      },
      quantity: parseInt(product.quantity),
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    insertOrder({
      userId,
      items,
      address,
      amount: parseFloat(totalAmount),
      paymentType: paymentOption
    });

    return {
      success: true,
      message: "Successfully place order",
      url: session.url!,
      paymentOption: paymentOption
    };

  } else {
     
    insertOrder({
      userId,
      items,
      address,
      amount: parseFloat(totalAmount),
      paymentType: paymentOption      
    });

    return {
      success: true,
      message: "Successfully place order",
      url: "",
      paymentOption: paymentOption
    };
  }

} catch (error) {
  console.log('processing error: ', error)
  return {
    success: false,
    message: String(error),
    url: "",
  };
}
}