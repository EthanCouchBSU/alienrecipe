import type { Metadata } from "next";

import "./globals.css";

import Navigation from './components/Navigation'
import AlienHead from './components/AlienHead'



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="pageContent"
      >
        
        <div className="content">
          
          <Navigation/>
          {children}
          <AlienHead/>
        </div>
        
      </body>
    </html>
  );
}
