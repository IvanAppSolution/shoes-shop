// import { MongoClient, ServerApiVersion, Document, WithId } from "mongodb";
import { Prisma, Product } from "./generated/prisma";
import prisma from "./prisma";

const seedProducts = async () => {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Product 1", price: 100, description: "Description 1", offerPrice: 90, category: "Category 1", inStock: true },
        { name: "Product 2", price: 100, description: "Description 2", offerPrice: 89, category: "Category 1", inStock: true },
        { name: "Product 3", price: 100, description: "Description 3", offerPrice: 80, category: "Category 1", inStock: true },
      ],
    });
  }
};

// Run seed if needed
// seedProducts();
interface GetProductsParams {
  search?: string;
  brand?: string;
  category?: string;
  tags?: string;
  perPage?: number;
  offset?: number;
}

export async function getProducts(params: GetProductsParams): Promise<[Product[], number]> {
    console.log('db-getProducts-params: ', params)
    let where = {}

    if (params.search) {
      where = {
        OR: [
          { name: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
          { brand: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
          { tags: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
        ],
      };
      
    } else if (params.brand) {
      where = {
        OR: [
          { brand: { contains: params.brand, mode: Prisma.QueryMode.insensitive } }
        ]
      };


    } else if (params.tags) {
      where = {
        OR: [
          { tags: { contains: params.tags, mode: Prisma.QueryMode.insensitive } }
        ]
      };

    } else {      
      where = {
      };      
    }

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: params.offset,
        take: params.perPage,          
        orderBy: {name:"asc"}
      }),
      prisma.product.count({where})
    ]);
    console.log('result-products.length: ', products.length)
    console.log('db-search-products-count: ', count)
    return [products, count];
 
}


export async function getProduct(id: string): Promise<Product> {
  // console.log('db-getProduct-id: ', id)
  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (!product) {
    return {} as Product; // Return an empty object if product not found
  }

  return product;
}
 
export async function addProduct(
  {
    name,
    brand,
    price,
    offerPrice,
    description,    
    inStock,
    category,
    tags,
    quantity,
    images,
  }:
  {
    name: string,
    brand: string,
    price: number,
    offerPrice: number,
    description?: string,    
    inStock?: boolean,
    category?: string,
    tags?: string,
    quantity: number,
    images?: string[] | undefined
  }
  ) {
    console.log('----------INSERT----------------')
    return prisma.product.create({
      data: { name, price, offerPrice, description, inStock, category, brand, tags, quantity, images: images ? images : undefined },
    });
}

export async function updateProduct(
  {
    id,
    name,
    brand,
    price,
    offerPrice,
    description,    
    inStock,
    category,
    tags,
    quantity,
    images,
  }:
  {
    id: string,
    name: string,
    brand: string,
    price: number,
    offerPrice: number,
    description?: string,    
    inStock?: boolean,
    category?: string,
    tags?: string,
    quantity: number,
    images?: string[] | undefined
  }
  ) {
    console.log('----------UPDATE----------------')
    return prisma.product.update({
      where: { id },
      data: { name, price, offerPrice, description, inStock, category, brand, tags, quantity, images: images ? images : undefined },
    });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

const randomPick = (values: string[]) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}

const orderBy = randomPick(['id', 'name', 'createdAt']);
const orderDir = randomPick([`asc`, `desc`]);

export async function getRelatedProducts({ productId = "" }: { productId: string }): Promise<Product[]> {
  let result = [] as Product[];
  if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId },
      });
     
      result = await prisma.product.findMany({
        where: {
          OR: [
            { brand: product?.brand }
          ],
          NOT: {
            id: productId,
          },
        },
        orderBy: { 
        },
        take: 8,
      });
    }
      
      const result2 = await prisma.product.findMany({
        where: {
          OR: [
            { tags: "best seller" }
          ],
          NOT: {
            id: productId,
          },
        },
        orderBy: { [orderBy]: orderDir },
        take: result.length < 8 ? 8 - result.length : 0,
      });

      return [...result, ...result2];
  // } else {
  //   return []
  // }
  
}

export async function getBestSellerProducts(): Promise<Product[] | []> {
  return await prisma.product.findMany({
    where: {
      OR: [
        { tags: 'best seller' }
      ],
    },
    orderBy: { [orderBy]: orderDir },
    take: 8,
  });  
}

//---------- Cart --------------//
export async function updateCart(
  userId: string,
  cartItems: Record<string, number>,
) {
  // await new Promise((resolve) => setTimeout(resolve, 1500));
  return prisma.user.update({
    where: { id: userId },
    data: { cartItems },
  });
}

export async function getCartItems(userId: string){
  return prisma.user.findFirst({select: {cartItems: true}, where: {id: userId}})
}

export async function getUserAddress(userId: string){
  return prisma.address.findFirst({where: {id: userId}})
}

export async function insertOrder(
  {
    userId,
    items,
    address,
    amount,
    paymentType,
    isPaid = false,
  }:
  {
    userId: string
    items: Record<string, number>,
    address: string
    amount: number
    paymentType: string,
    isPaid?: boolean
  }
  ) {
    try {
      return prisma.order.create({
        data: { userId, items, address, amount, paymentType, isPaid}
      });
    } catch(error) {
      console.error('Error inserting order:', error);
      throw error;
    }    
}