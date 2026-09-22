import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"The Sushant Universe",description:"An independent fan-made tribute to Sushant Singh Rajput."};
export default function RootLayout({children}:LayoutProps<"/">){return <html lang="en"><body>{children}</body></html>}
