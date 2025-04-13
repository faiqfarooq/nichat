import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import { CloudinaryProvider } from "@/providers/CloudinaryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import CallNotificationProvider from "@/providers/CallNotificationProvider";
import EnhancedNavbar from "@/components/layout/EnhancedNavbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Sidebar from "@/components/layout/Sidebar";

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
                  <div className="flex h-screen">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4  ">
                      <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full md:w-3/4 flex flex-col">
                      {/* Sticky Navbar */}
                      <div className="h-16 sticky top-0 z-10 bg-white shadow">
                        <NavbarWrapper />
                      </div>

                      {/* Scrollable Content */}
                      <div
                        className="overflow-auto"
                        style={{ height: "calc(100vh - 68px)" }}
                      >
                        {children}
                      </div>
                    </div>
                  </div>

                  <FooterWrapper />
                </CallNotificationProvider>
              </CloudinaryProvider>
            </SocketProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
