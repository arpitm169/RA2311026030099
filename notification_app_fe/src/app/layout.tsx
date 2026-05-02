import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "../../context/NotificationContext";
import NavBar from "../../components/NavBar";

export const metadata: Metadata = {
  title: "NotifyHub — Campus Notification System",
  description: "A priority-based notification inbox for campus events, placements, and results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <NotificationProvider>
          <NavBar />
          <main style={{
            padding: '32px 24px',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: 'calc(100vh - 64px)',
          }}>
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
