// import ServiceClient from "./ServiceClient";

// export default function ServicesPage() {


//   return (
//     <>
//     <ServiceClient/>
//     </>
//   )
// }

import type { Metadata } from "next";
import Script from "next/script";
import ServiceClient from "./ServiceClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ITFixer @199 – Laptop, PC & MacBook Repair Services in Chennai",
    description:
      "ITFixer @199 offers laptop repair, PC service, MacBook repair, data recovery, networking, and home IT support services in Ramapuram, Chennai.",
    keywords: [
      "ITFixer 199 services",
      "laptop repair Chennai",
      "computer service Ramapuram",
      "MacBook repair Chennai",
      "IT services Chennai",
      "data recovery Chennai",
      "networking support",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.itfixer199.com/services",
    },
    openGraph: {
      title: "ITFixer @199 – Reliable IT Repair & Support Services",
      description:
        "Professional laptop repair, PC service, MacBook repair, data recovery, and home IT support in Ramapuram, Chennai.",
      url: "https://www.itfixer199.com/services",
      siteName: "ITFixer @199",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "ITFixer @199 Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ITFixer @199 – IT Repair Services in Chennai",
      description:
        "Laptop | PC | MacBook repair | Networking | Data recovery | Home support services in Chennai.",
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


const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "ITFixer @199 – Laptop, PC & MacBook Repair Services",
  url: "https://www.itfixer199.com/services",
  description:
    "ITFixer @199 provides laptop repair, computer service, MacBook repair, data recovery, networking, and home IT solutions in Ramapuram, Chennai.",
  provider: {
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
  areaServed: "Chennai, Tamil Nadu, India",
  serviceType: [
    "Laptop Repair",
    "Computer Repair",
    "MacBook Repair",
    "Data Recovery",
    "Networking Support",
    "Home IT Support",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema),
        }}
      />

      <ServiceClient />
    </>
  );
}
