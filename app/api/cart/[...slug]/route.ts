"use server";
import { z } from 'zod';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }): Promise<Response> {
  try {
    const { slug } = await params;
    
    if (slug[0] === "getUserCartItems" && slug[1].length) {
      return getUserCartItems(slug[1])
    } else if (slug[0] === "getUserAddress" && slug[1].length) {
      return getUserAddressInDb(slug[1])
      
    } else {
      return new Response(
        null,
        {status: 404}
      )
    }
  } catch (error) {
    // console.error("Error processing request:", error);
    return new Response(
      null,
      {status: 500}
    )
  }

  async function getUserCartItems (userId: string)  {
    try {
      const result = await prisma.user.findFirst({select: {cartItems: true}, where: { id: userId}})
      // console.log('result: ', result)
      return new Response(
        JSON.stringify(result),
        {
          headers: {"Content-Type": "application/json"},
          status: 201,
        }
      )
      
    } catch (error: any) {
      return new Response(
        null,
        {
          status: 404
        }
      )
    } 
  }

  async function getUserAddressInDb (userId: string)  {
    try {   
      const address = await prisma.address.findMany({where: {userId}})
   
      return new Response(
        JSON.stringify(address), 
        {
          headers: {"Content-Type": "application/json"},
          status: 201,
        }
      )
   
    } catch (error: any) {
      console.error("Error in updateUserCart: ", error);
      return new Response(
        null,
        {
          status: 404
        }
      )
    } 
  }

}


export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }): Promise<Response> {
  try {
    const { slug } = await params;

    if (slug?.length === 1 && slug[0] === "updateUserCart") {
      return updateUserCart(request);
    } else {
      return new Response(
        null,
        {status: 404}
      )
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      null,
      {status: 500}
    )
  } 
 
 

  async function updateUserCart (request: Request) {
    try {
      const schema = z.object({
        cartItems: z.string(),
        userId: z.string()
      })
      
      const body = await request.json();
      const { cartItems, userId} = schema.parse(body);
      const _cartItems =  JSON.parse(cartItems);
  
      const result = await prisma.user.update({where: { id: userId}, data: {cartItems: _cartItems}})
  
      return new Response(
        JSON.stringify(result), 
        {
          headers: {"Content-Type": "application/json"},
          status: 201,
        }
      )
    } catch (error: any) {
      console.error("Error in updateUserCart: ", error);
      return new Response(
        null,
        {status: 500}
      )
    } 
  }

}
