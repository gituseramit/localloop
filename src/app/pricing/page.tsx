import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Customer",
      price: "Free",
      desc: "For local residents.",
      features: ["Browse local listings", "Secure payments", "Order tracking", "24/7 Support access"],
    },
    {
      name: "Partner",
      price: "5%",
      desc: "Per transaction fee.",
      features: ["Free listing", "Direct payouts", "Order management dashboard", "Zero monthly fees"],
      highlight: true
    },
    {
      name: "Delivery Agent",
      price: "100%",
      desc: "You keep all delivery fees.",
      features: ["Flexible hours", "Hyper-local routing", "Weekly payouts", "Zero platform commissions"],
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--on-background)]">
            Transparent Pricing
          </h1>
          <p className="text-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            No hidden fees. We believe in empowering local commerce, not taxing it overbearingly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((t, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl border flex flex-col gap-6 ${t.highlight ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] shadow-lg scale-105' : 'bg-[var(--surface-container-low)] border-[var(--outline-variant)] text-[var(--on-surface)]'}`}
            >
              <div>
                <h3 className={`text-2xl font-bold ${t.highlight ? 'text-[var(--on-primary)]' : 'text-[var(--primary)]'}`}>{t.name}</h3>
                <div className="text-4xl font-black mt-2">{t.price}</div>
                <p className={`mt-2 ${t.highlight ? 'text-[var(--on-primary)]/80' : 'text-[var(--on-surface-variant)]'}`}>{t.desc}</p>
              </div>
              
              <ul className="space-y-4 mt-4 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${t.highlight ? 'text-[var(--on-primary)]' : 'text-[var(--primary)]'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={`/signup?role=${t.name.toUpperCase()}`}
                className={`w-full py-3 text-center inline-block rounded-full font-bold transition-transform hover:scale-105 ${t.highlight ? 'bg-[var(--on-primary)] text-[var(--primary)]' : 'bg-[var(--primary)] text-[var(--on-primary)]'}`}
              >
                Join Now
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
