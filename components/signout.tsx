"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


export default function SignOut() {
  
  const handleSignOut = async () => {
    await authClient.signOut();
  }
  
  return (
      <Button
        onClick={handleSignOut}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign Out
      </Button>
  )
}