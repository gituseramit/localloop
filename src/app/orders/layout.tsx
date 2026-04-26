import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
