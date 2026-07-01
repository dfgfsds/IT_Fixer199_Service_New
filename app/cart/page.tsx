import type { Metadata } from "next";
import Script from "next/script";
import CartClient from "./CartClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shopping Cart | ITFixer199 — Review & Secure Checkout",
    description:
      "View your shopping cart at ITFixer199. Review selected products, update quantities, and proceed to fast and secure checkout.",
    keywords: [
      "ITFixer199 cart",
      "shopping cart",
      "checkout",
      "review order",
      "online shopping",
      "tech accessories cart",
    ],
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "https://www.itfixer199.com/cart",
    },
    openGraph: {
      title: "Shopping Cart | ITFixer199 — Review Your Products",
      description:
        "Check the items in your ITFixer199 shopping cart and continue to secure checkout.",
      url: "https://www.itfixer199.com/cart",
      siteName: "ITFixer199",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "ITFixer199 Shopping Cart",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Shopping Cart | ITFixer199",
      description:
        "Review your selected products and continue to secure checkout.",
      images: [
        "/logo.png",
      ],
      site: "@itfixerat199",
    },
    other: {
      image_src: "/logo.png",
    },
  };
}

const cartSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Shopping Cart",
  url: "https://www.itfixer199.com/cart",
  description:
    "View and manage the products in your ITFixer199 shopping cart before checkout.",
  isPartOf: {
    "@type": "WebSite",
    name: "ITFixer199",
    url: "https://www.itfixer199.com",
  },
  publisher: {
    "@type": "Organization",
    name: "ITFixer199",
    url: "https://www.itfixer199.com",
    logo: {
      "@type": "ImageObject",
      url: "/logo.png",
    },
  },
};

export default function CartPage() {
  return (
    <>
      <Script
        id="cart-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cartSchema),
        }}
      />

      <CartClient />
    </>
  );
}