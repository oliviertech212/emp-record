import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import{ Provider }from "./Provider";
import "./globals.css";



const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "Employee's Record",
  description: "Employee's Record Web Application",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Poppins&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <Provider >
        <body className={roboto.className}>{children}</body>
      </Provider>
    </html>
  );
}
