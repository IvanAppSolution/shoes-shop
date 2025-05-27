"use server";
import { z } from 'zod'
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Product } from '@/lib/generated/prisma';

//------------------  GET  ------------------
export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }): Promise<Response> {
  try {
    const { slug } = await params;
    // console.log('api/product/slug: ', slug)
    if (slug.length === 1 && slug[0] === "getBestSellerProducts") {
      return queryGetBestSellerProducts()
    } else if (slug.length === 2 && slug[0] === "getRelatedProducts") {
      return queryRelatedProducts(slug[1])
    }  else {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  async function queryRelatedProducts(productId: string)  {
    // console.log('api-queryRelatedProducts: ', productId)
    try {
      if (productId) {
        let result: Product[] = [];   
        result = await prisma.product.findMany({
          where: {
            OR: [
              { tags: 'best seller' }
            ],
            NOT: {
              id: productId,
            },
          },
          take: 10,
        });
      
  
        // console.log('api-result: ', result)
        return new Response(
          JSON.stringify(result), 
          {
            headers: {"Content-Type": "application/json"},
            status: 201,
          }
        )
      } else {
        return NextResponse.json({ error: "Incorrect input" }, { status: 400 });
      }
    } catch(error) {
      console.log('error: ', error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async function queryGetBestSellerProducts() {
    const result = await prisma.product.findMany({
      where: {
        tags: {
          contains: 'best seller'
        }
      },
      take: 10
    })
    // console.log('api-result: ', result)
    return new Response(
      JSON.stringify(result), 
      {
        headers: {"Content-Type": "application/json"},
        status: 201,
      }
    )
     
  }

}
 
 



//------------------  POST  ------------------
export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }): Promise<Response> {
  try {
    const { slug } = await params;

    if (slug.length === 1 && slug[0] === "getProductsByArray") {
      return queryGetProductsByArray(request)
    }

    return NextResponse.json({ error: "Request not found" }, { status: 404 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  

  async function queryGetProductsByArray(request: Request)  {
    try {
      const stringArraySchema = z.array(z.string());
      const body = await request.json();
      const productIds = stringArraySchema.parse(body);
  
      if (productIds.length) {
        const result = await prisma.product.findMany({
          where: {
            id: { in: productIds }
          }
        })
        console.log('api-result-products.length: ', result.length)
        return new Response(
          JSON.stringify(result), 
          {
            headers: {"Content-Type": "application/json"},
            status: 201,
          }
        )
      } else {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  
  }

}

 