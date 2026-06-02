
import type { Metadata } from "next";
import Script from "next/script";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
  title: "Privacy Policy | ITFixer199 – Data Protection & User Safety",
  description:
    "Read the ITFixer199 Privacy Policy to learn how we protect your data, secure your information, and ensure complete user privacy and safety.",
  keywords: [
    "ITFixer199 privacy policy",
    "data protection",
    "user data security",
    "online privacy",
    "information safety",
    "policy page",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.itfixer199.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | ITFixer199 – Data Protection & User Safety",
    description:
      "Learn how ITFixer199 protects your personal data and ensures online privacy and security.",
    url: "https://www.itfixer199.com/privacy-policy",
    siteName: "ITFixer199",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - ITFixer199",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | ITFixer199 – Data Protection & User Safety",
    description:
      "Understand how ITFixer199 secures and protects your personal information online.",
    images: [
      "/logo.png",
    ],
    site: "@itfixerat199",
  },
  other: {
    image_src:
      "/logo.png",
  },
};
}

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy – ITFixer199",
  url: "https://www.itfixer199.com/privacy-policy",
  description:
    "The official privacy policy of ITFixer199, explaining data protection, user privacy, and information security practices.",
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Script
        id="privacy-policy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacySchema),
        }}
      />
      <PrivacyPolicyClient/>
</>
     
  )
}
