import { CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Discover Local Services",
      desc: "Browse a curated marketplace of verified local professionals, from print shops to cyber cafes.",
    },
    {
      step: "02",
      title: "Book & Pay Securely",
      desc: "Select exactly what you need and checkout through our encrypted payment gateway.",
    },
    {
      step: "03",
      title: "Task Fulfilled",
      desc: "The nearest partner begins work immediately. You get real-time tracking until completion.",
    },
    {
      step: "04",
      title: "Doorstep Delivery",
      desc: "If your service requires physical delivery (like prints), our agents handle the final mile.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--on-background)]">
            How LocalLoop Works
          </h1>
          <p className="text-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            A seamless bridge connecting your daily needs with specialized local businesses in real-time.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)] shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-[var(--primary)] transition-colors"
            >
              <div className="text-5xl font-black text-[var(--primary)]/10 absolute -right-4 -top-8 group-hover:scale-110 transition-transform">
                {s.step}
              </div>
              <CheckCircle2 className="w-8 h-8 text-[var(--primary)]" />
              <h3 className="text-2xl font-bold text-[var(--on-surface)]">{s.title}</h3>
              <p className="text-[var(--on-surface-variant)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
