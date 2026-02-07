import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pulse-demo.vercel.app"),
  title: "Pulse - Freelancer Revenue Intelligence",
  description: "Track every dollar. Predict your income. Your financial co-pilot for freelance work.",
  openGraph: {
    title: "Pulse - Freelancer Revenue Intelligence",
    description: "Track every dollar. Predict your income.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse - Freelancer Revenue Intelligence",
    description: "Track every dollar. Predict your income. Your financial co-pilot for freelance work.",
  },
  other: {
    "theme-color": "#F5F2EA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
