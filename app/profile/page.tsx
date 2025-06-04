import { headers } from "next/headers";
import Content from "./content";
import { auth } from "@/lib/auth";
import { getUserInfo, getAddress } from "@/lib/db";
import { User } from "@/lib/generated/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Profile() {
  const session = await auth.api.getSession({
      headers: await headers()
  })
  
  if (!session) {
    return <div className="m-48 text-center">Please sign in to view your profile.<br/><br/>
      <Link href="/sign-in"><Button>Sign In</Button></Link>
    </div>;
  } 
  
  console.log("Session user ID:", session.user.id);
  const user = getUserInfo(session.user.id);
  const address = getAddress(session.user.id);


  return (
    <Content userPromise={user} addressPromise={address}  />
  )
}