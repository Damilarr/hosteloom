import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hosteloom | Intelligent Hostel Operations",
  description: "Digitize hostel administration and allocation for Nigerian institutions and private hostel owners.",
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  openGraph: {
    title: "Hosteloom | Intelligent Hostel Operations",
    description: "Digitize hostel administration and allocation for Nigerian institutions and private hostel owners.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hosteloom | Intelligent Hostel Operations",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hosteloom | Intelligent Hostel Operations",
    description: "Digitize hostel administration and allocation for Nigerian institutions and private hostel owners.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${outfit.variable} antialiased bg-hosteloom-bg text-hosteloom-text font-body overflow-x-hidden selection:bg-hosteloom-accent selection:text-hosteloom-bg`}>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--color-hosteloom-surface)',
              border: '1px solid var(--color-hosteloom-border)',
              color: 'var(--color-hosteloom-text)',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  );
}
