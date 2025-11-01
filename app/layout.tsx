import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalFooter } from "./components/ConditionalFooter";

const ttRamillas = localFont({
  src: [
    {
      path: "../public/fonts/TT_Ramillas_Trial_ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_ExtraLight_Italic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Light_Italic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Medium_Italic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Bold_Italic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_ExtraBold_Italic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/TT_Ramillas_Trial_Black_Italic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-tt-ramillas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Tarlac Chronicle | Local News & Community Stories",
  description:
    "Your trusted source for local news, stories, and community updates in Tarlac",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ttRamillas.variable} antialiased`}>
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
