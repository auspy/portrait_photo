import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Picture Outline Generator",
  description:
    "An AI-powered tool that automatically adds clean outlines to objects in your images. Perfect for creating stand-out visuals, product highlights, and eye-catching content.",
  keywords:
    "AI, image processing, outline generator, product images, visual content, object detection, image editing",
  openGraph: {
    title: "Picture Outline Generator",
    description:
      "Create eye-catching visuals with automatic object detection and outline generation. Perfect for product highlights and visual content.",
    type: "website",
    url: "http://localhost:3000",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Picture Outline Generator Preview",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picture Outline Generator",
    description:
      "Create eye-catching visuals with automatic object detection and outline generation. Perfect for product highlights and visual content.",
    // images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  const googleAnalytics = process.env.NEXT_PUBLIC_GOOGLE_ADD_ID;
  return (
    // <ClerkProvider>
    <html lang="en">
      {googleAnalytics && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
          ></Script>
          <Script id="google-analytics">
            {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleAnalytics}');`}
          </Script>
        </>
      )}
      <body className={`${inter.className}  `}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        {/* <VizolvClient /> */}
      </body>
    </html>
    // </ClerkProvider>
  );
}
