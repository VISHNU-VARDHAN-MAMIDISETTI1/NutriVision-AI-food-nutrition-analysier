import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "NutriVision | AI-Powered Food Analysis",
  description: "Analyze food, track macros, and get AI-powered diet advice in an instant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
