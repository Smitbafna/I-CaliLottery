import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-card">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-7xl px-6 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-card text-center border-t">
        <Link
          isExternal
          className="flex items-center justify-center gap-2 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Calimero-ICP</p>
        </Link>
      </footer>
    </div>
  );
}
