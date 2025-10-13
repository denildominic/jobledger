import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AppThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Job Finder",
  description: "Find your next role. Upload your resume and assess your fit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppThemeProvider>
      </body>
    </html>
  );
}
