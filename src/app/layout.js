import "./globals.css";
import CustomSessionProvider from "@/components/auth/CustomSessionProvider";
import SocketProvider from "@/providers/SocketProvider";
import { CloudinaryProvider } from "@/providers/CloudinaryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import CallNotificationProvider from "@/providers/CallNotificationProvider";
import MainLayout from "@/components/layout/MainLayout";

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
        <CustomSessionProvider>
          <ReduxProvider>
            <SocketProvider>
              <CloudinaryProvider>
                <CallNotificationProvider>
                  <MainLayout>{children}</MainLayout>
                </CallNotificationProvider>
              </CloudinaryProvider>
            </SocketProvider>
          </ReduxProvider>
        </CustomSessionProvider>
      </body>
    </html>
  );
}
