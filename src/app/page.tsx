import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default async function Home() { 
  const {userId} = await auth();
  const isAuth = !!userId;

  return (
    <div className=" w-screen min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2d">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className ="mr-3 font-semibold text-5xl">Chat with any PDF</h1>
            <UserButton />
          </div>
          <div  className="flex mt-2">
            {isAuth && <Button>
              Go to Chats
            </Button>}
          </div>
          <p className = "max-w-xl mt-1 text-lg text-slate-600">
            Join millions of people who use PDF Buddy to chat with any PDF
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ):
            (<Link href="/sign-in">
              <Button>
                Log in to get Started 
                <LogIn className="w-4 h-4 ml-2"/>
              </Button>
            </Link>)}
          </div>
        </div>
      </div>
    </div>
  );
}
