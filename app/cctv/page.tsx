import type { Metadata } from "next";
import CctvClient from "./CctvClient";

export const metadata: Metadata = {
    title: "ITFixer199 CCTV | Premium Security Solutions",
    description:
        "Explore ITFixer199 CCTV products and installation services for enhanced security in your home or business.",
    keywords: [
        "ITFixer199 CCTV",
        "CCTV camera",
        "security camera",
        "CCTV installation",
    ],
    robots: {
        index: true,
        follow: true,
    },
};

export default function CctvPage() {
    return (
        <>
            <CctvClient />
        </>
    );
}
