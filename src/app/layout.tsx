import type { Metadata } from "next";

import "./globals.css";
import { CustomerProvider } from "@/context/CustomerContext";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FiltersSection from "@/components/FiltersSection";

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
      <CustomerProvider>
        <body className="flex flex-col h-screen" suppressHydrationWarning>
          <Header/>
          <FiltersSection/>   
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
          <Footer/>
        </body>
      </CustomerProvider>
    </html>
  );
}