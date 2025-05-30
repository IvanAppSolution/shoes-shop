import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import { AppContextProvider } from "@/components/context";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { headers } from 'next/headers';
import  LoadTimeTracker from '@/components/load-time';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Shop",
  description: "Online Shop by Ivan Alcuino",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const url = headersList.get('x-url') || '';
  // console.log('url: ', url)
  const inAdminPage = url.includes('admin');
  // console.log('inAdminPage: ', inAdminPage)
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${outfit.variable} ${geistMono.variable} antialiased`}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <AppContextProvider>
                  <Header></Header>
                  <main className='text-default min-h-screen text-gray-700 bg-white'>
                    <div className={"px-6 " + (inAdminPage ? "" : " md:px-16 lg:px-24 xl:px-32")}> 
                      <NuqsAdapter>                            
                        {children}
                      </NuqsAdapter>
                    </div>
                  </main>
                </AppContextProvider>
              <Toaster />
            </ThemeProvider>        
            <LoadTimeTracker /> 
          <Footer/>
        </body>
      </html>
    );
}
