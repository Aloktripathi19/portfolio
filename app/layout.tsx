import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Inter_Tight } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-f", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-f", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-f", display: "swap" });
const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = `${profile.name} — ${profile.role}`;
const description =
  "Full-stack software engineer and AWS Certified Developer shipping production Next.js, Python and PostgreSQL apps used by 10,000+ people, including RAG pipelines with pgvector.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  keywords: [
    "Alok Ram Tripathi",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js",
    "React",
    "Python",
    "PostgreSQL",
    "RAG",
    "pgvector",
    "AWS Certified Developer",
  ],
  authors: [{ name: profile.name, url: profile.socials.github }],
  openGraph: { type: "website", title, description, siteName: profile.name, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#eeebe3",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  alumniOf: "Mahakal Institute of Technology",
  sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.hackerrank],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable} ${body.variable}`}>
      <body className="grain font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
