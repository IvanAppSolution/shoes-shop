## Online Product 
Project by Ivan Alcuino using NextJs.

## Description
Online product project that display products from fakeapi.platzi.com using nuqs filter to search and paginate products. It uses better-auth to manage user management Sign-in, Sign-up, Sign-out, Forgot password, Reset Password. Using zod to handle form fields and page validation. Using sendgrid to handle email. It has a middleware that manage page for users and admin.<br/>

## Libraries
Shadcn<br/>
drizzle ORM<br/>
Neon/Postgresql<br/>
nuqs<br/>
better-auth<br/>
zod<br/>
sendgrid<br/>
<br/>

Host server: Vercel<br/>
[Online-product](https://online-product.vercel.app/)<br/>

Preview:
![Image](https://github.com/user-attachments/assets/0bac64ea-06df-475c-9192-b2dc072aefe2)


## Getting Started
First, run the development server:
pnpm install
npx prisma db push
npx prisma generate
pnpm dev
