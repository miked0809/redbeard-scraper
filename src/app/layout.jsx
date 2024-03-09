import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Redbeard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <nav>
            <div className="float-end m-4">
              <ModeToggle />
            </div>
          </nav>
          <main className="flex min-h-screen flex-col items-center Xjustify-between p-24">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
