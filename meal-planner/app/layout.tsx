import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Toast from "@/widgets/Toast";

export const metadata: Metadata = {
    title: "Meal planner",
    description: "Weekly meal planner",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <Toast />
                </Providers>
            </body>
        </html>
    );
}
