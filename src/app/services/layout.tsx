import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#f8fafc" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
