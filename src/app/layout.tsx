import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TARANG | Empowering Artists. Connecting Safely.",
  description: "A safety-first digital platform connecting verified artists with clients for live events in India. Secure payments, verified clients, and trusted reputation system.",
  keywords: "artists, performers, live events, India, booking platform, safe hiring",
  openGraph: {
    title: "TARANG | Empowering Artists. Connecting Safely.",
    description: "A safety-first digital platform connecting verified artists with clients for live events.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
