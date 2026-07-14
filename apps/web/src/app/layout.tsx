import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { StoreProvider } from "@/lib/store";
import { CartSidebar } from "@/components/ui/cart-sidebar";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontHeading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SagaLeor | AI-Powered Luxury Fashion",
    template: "%s | SagaLeor",
  },
  description:
    "Discover your unique Style DNA with SagaLeor — where artificial intelligence meets haute couture. AI-curated luxury fashion, personalized styling, and a digital wardrobe architect.",
  keywords: [
    "luxury fashion",
    "AI stylist",
    "personal fashion intelligence",
    "Style DNA",
    "curated fashion",
    "premium clothing",
    "AI wardrobe",
    "SagaLeor",
  ],
  openGraph: {
    title: "SagaLeor | AI-Powered Luxury Fashion",
    description:
      "Where artificial intelligence meets haute couture. Discover your unique Style DNA.",
    siteName: "SagaLeor",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SagaLeor | AI-Powered Luxury Fashion",
    description:
      "Where artificial intelligence meets haute couture. Discover your unique Style DNA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  metadataBase: new URL("https://sagaleor.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>
          <StoreProvider>
            {children}
            <CartSidebar />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
