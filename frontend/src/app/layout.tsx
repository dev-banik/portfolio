import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/shared/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parthib Banik — Backend Software Engineer",
    template: "%s | Parthib Banik",
  },
  description:
    "Backend Software Engineer specializing in .NET Core, C#, scalable APIs, and cloud-based systems.",
  keywords: ["backend", ".net", "csharp", "software engineer", "Dhaka", "Bangladesh"],
  authors: [{ name: "Parthib Banik" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Parthib Banik Portfolio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #313244" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
