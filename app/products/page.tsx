import type { Metadata } from "next";
import Script from "next/script";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
    title: "ITFixer199 Products | Premium Tech & Computer Accessories",
    description:
        "Explore ITFixer199 products including tech gadgets, PC accessories, mobile accessories, and repair tools designed for performance and durability.",
    keywords: [
        "ITFixer199 products",
        "tech accessories",
        "computer accessories",
        "mobile gadgets",
        "repair tools",
        "electronic products",
    ],
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "https://www.itfixer199.com/products",
    },
    openGraph: {
        title: "ITFixer199 Products | Premium Tech & Computer Accessories",
        description:
            "Browse the latest tech accessories, computer devices, gadgets, and repair tools on ITFixer199.",
        url: "https://www.itfixer199.com/products",
        siteName: "ITFixer199",
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "ITFixer199 Products",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "ITFixer199 Products | Premium Tech & Computer Accessories",
        description:
            "Discover top-quality gadgets, PC accessories, tools, and tech essentials on ITFixer199.",
        images: [
            "/logo.png",
        ],
        site: "@itfixerat199",
    },
    other: {
        image_src: "/logo.png",
    },
};

const productsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ITFixer199 Products",
    url: "https://www.itfixer199.com/products",
    description:
        "Explore a wide range of tech gadgets, computer accessories, mobile accessories, and repair tools from ITFixer199.",
    publisher: {
        "@type": "Organization",
        name: "ITFixer199",
        url: "https://www.itfixer199.com",
        logo: {
            "@type": "ImageObject",
            url: "/logo.png",
        },
    },
    mainEntity: {
        "@type": "ItemList",
        itemListElement: [],
    },
};

export default function AllProductsPage() {
    return (
        <>
            <Script
                id="products-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productsSchema),
                }}
            />

            <ProductsClient />
        </>
    );
}