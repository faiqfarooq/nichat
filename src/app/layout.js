import "./globals.css";

export const metadata = {
  title: "nichat | A modern messaging application",
  description: "A modern messaging application",
  icons: {
    icon: "/log.png",
    shortcut: "/log.png",
    apple: "/log.png",
  },
};

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
