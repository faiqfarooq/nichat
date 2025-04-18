<<<<<<< HEAD
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import { CloudinaryProvider } from "@/providers/CloudinaryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import CallNotificationProvider from "@/providers/CallNotificationProvider";
import MainLayout from "@/components/layout/MainLayout";
=======
import './globals.css'
import AuthProvider from '@/providers/AuthProvider';
import SocketProvider from '@/providers/SocketProvider';
import { CloudinaryProvider } from '@/providers/CloudinaryProvider';
import ReduxProvider from '@/providers/ReduxProvider';
>>>>>>> parent of 93a35b4 (added call)

export const metadata = {
  title: "nichat | A modern messaging application",
  description: "A modern messaging application",
  icons: {
    icon: "/log.png",
    shortcut: "/log.png",
    apple: "/log.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white min-h-screen">
        <AuthProvider>
          <ReduxProvider>
            <SocketProvider>
              <CloudinaryProvider>
<<<<<<< HEAD
                <CallNotificationProvider>
                  <MainLayout>{children}</MainLayout>
                </CallNotificationProvider>
=======
                {children}
>>>>>>> parent of 93a35b4 (added call)
              </CloudinaryProvider>
            </SocketProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
