import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bike Sales Analytics Dashboard | Customer Segmentation Analysis",
  description: "Interactive dashboard for analyzing bike customer segments and identifying potential buyers through demographic clustering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen" suppressHydrationWarning>
        <Header/>        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}