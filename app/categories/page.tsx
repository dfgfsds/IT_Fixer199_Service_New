
import type { Metadata } from "next";
import Script from "next/script";
import CategoriesClient from "./CategoriesClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "ITFixer @199 – Service Categories | Laptop, PC & Repair Solutions",
    description:
      "Explore ITFixer @199 service categories including laptop repair, PC service, MacBook repair, networking, data recovery and home service support.",
    keywords: [
      "ITFixer 199 categories",
      "laptop repair Chennai",
      "PC service Ramapuram",
      "MacBook repair Chennai",
      "ITFixer services",
      "computer repair categories",
      "data recovery Chennai",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.itfixer199.com/categories",
    },
    openGraph: {
      title: "ITFixer @199 – Service Categories",
      description:
        "Browse service categories including laptop repair, PC service, MacBook repair, networking, and data recovery solutions.",
      url: "https://www.itfixer199.com/categories",
      siteName: "ITFixer @199",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "ITFixer @199 Service Categories",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ITFixer @199 – Service Categories",
      description:
        "Explore laptop repair, PC repair, MacBook services, networking and IT support categories.",
      images: [
        "/logo.png",
      ],
      site: "@itfixerat199",
    },
    other: {
      image_src: "/logo.png",
    },
  };
};

const categoriesSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Service Categories – ITFixer @199",
  url: "https://www.itfixer199.com/categories",
  description:
    "Browse all service categories offered by ITFixer @199 including laptop repair, computer service, MacBook repair, networking, home service, and data recovery.",
  publisher: {
    "@type": "LocalBusiness",
    name: "ITFixer @199",
    url: "https://www.itfixer199.com/",
    telephone: "+91 9385939985",
    email: "info@itfixer199.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "No.91, Ground Floor, Kothari Nagar 2nd Main Road, Ramapuram",
      addressLocality: "Chennai",
      postalCode: "600089",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/itfixerat199",
      "https://www.instagram.com/it.fixerat_199",
      "https://www.youtube.com/@ITFixeAt199",
      "https://www.linkedin.com/company/it-fixer-at199/about/",
      "https://x.com/itfixerat199",
    ],
  },
};

export default function CategoriesPage() {
  return (
    <>
      <Script
        id="categories-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoriesSchema),
        }}
      />
      <CategoriesClient />;
    </>
  );
}
