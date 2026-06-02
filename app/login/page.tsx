import type { Metadata } from "next";
import Script from "next/script";
import LoginClient from "./LoginClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login | ITFixer199 — Access Your Account Securely",
    description:
      "Login to your ITFixer199 account to manage orders, track purchases, access support, and enjoy a personalized shopping experience.",
    keywords: [
      "ITFixer199 login",
      "user login",
      "customer login",
      "account access",
      "sign in",
      "tech products login",
    ],
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "https://www.itfixer199.com/login",
    },
    openGraph: {
      title: "Login | ITFixer199 — Secure Account Access",
      description:
        "Access your ITFixer199 account to view orders, manage details, and personalize your experience.",
      url: "https://www.itfixer199.com/login",
      siteName: "ITFixer199",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "ITFixer199 Login",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Login | ITFixer199",
      description:
        "Sign in to your ITFixer199 account for personalized shopping and order tracking.",
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

const loginSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Login",
  url: "https://www.itfixer199.com/login",
  description:
    "Login to your ITFixer199 account to manage your orders, profile and shopping preferences.",
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

export default function LoginPage() {
  return (
    <>
      <Script
        id="login-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(loginSchema),
        }}
      />

      <LoginClient />
    </>
  );
}