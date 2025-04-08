import './globals.css'
import AuthProvider from '@/providers/AuthProvider';
import SocketProvider from '@/providers/SocketProvider';

export const metadata = {
  title: 'Chat App',
  description: 'A modern messaging application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark text-white min-h-screen">
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}