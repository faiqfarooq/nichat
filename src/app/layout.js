import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import { CloudinaryProvider } from "@/providers/CloudinaryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import CallNotificationProvider from "@/providers/CallNotificationProvider";
import MainLayout from "@/components/layout/MainLayout";

export const metadata = {
  title: "Chat App",
  description: "A modern messaging application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white min-h-screen">
        <AuthProvider>
          <ReduxProvider>
            <SocketProvider>
              <CloudinaryProvider>
                <CallNotificationProvider>
                  <MainLayout>
                    {children}
                  </MainLayout>
                </CallNotificationProvider>
              </CloudinaryProvider>
            </SocketProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
