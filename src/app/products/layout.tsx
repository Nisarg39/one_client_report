import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Journey to Mastery | OneReport",
    description: "Explore the evolutionary path of OneReport, from initial learning to enterprise-scale marketing intelligence.",
    alternates: {
        canonical: "/products",
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
