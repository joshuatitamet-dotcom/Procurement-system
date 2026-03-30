import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Procurement System",
  description: "Procurement Management Application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
