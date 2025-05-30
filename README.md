## Online Product 
Project by Ivan Alcuino using NextJs(15)/MongoDB/Tailwindcss/Shadcn.

## Description
* Online shoes shop that stores record to mongodb using shadcn ui and tailwindcss.
* It uses nuqs filter to search and paginate products.
* It uses better-auth to manage user management Sign-in, Sign-up, Sign-out, Forgot password, Reset Password.
* Using zod to handle form fields and page validation.
* User can add product to cart and purchase using stripe payment in test-mode.
* Using sendgrid to handle email. It has a middleware that manage page for users and admin.
  <br/>
 **Admin**
* It manage products, orders and users in admin page.
* Stores images to vercel blob file storage.
<br/>

## Libraries
* Shadcn
* Prisma ORM
* Mongodb
* Nuqs
* Better-auth
* Zod
* Sendgrid
* Vercel blob file storage

<br/><br/>

Host server: Vercel<br/>
[Shoes Shop](https://shoes-shop-iota.vercel.app/)<br/>

Preview:
![Image](https://github.com/user-attachments/assets/b76c61c8-2f8b-4d62-8d04-8d9f773e5ef0)


## Getting Started
First, run the development server:
pnpm install
npx prisma db push
npx prisma generate
pnpm dev
