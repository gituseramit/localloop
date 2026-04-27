import { MessageSquare, Mail, PhoneCall } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    { q: "How long do deliveries usually take?", a: "Most hyper-local tasks are completed within 45-90 minutes depending on the service volume." },
    { q: "How do I become a Partner?", a: "Sign up as a Partner from the dashboard. Approvals typically take 24-48 hours after identity verification." },
    { q: "What is the refund policy?", a: "If a job is not completed or rejected by the partner, a full refund is processed to the source account instantly." }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-16">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--on-background)]">
            Support Center
          </h1>
          <p className="text-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            We&apos;re here to help you navigate LocalLoop seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[var(--surface-container)] flex flex-col items-center text-center gap-3">
            <MessageSquare className="w-8 h-8 text-[var(--primary)]" />
            <h3 className="font-bold text-[var(--on-surface)]">Live Chat</h3>
            <p className="text-sm text-[var(--on-surface-variant)]">Available 9 AM - 9 PM</p>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--surface-container)] flex flex-col items-center text-center gap-3">
            <Mail className="w-8 h-8 text-[var(--primary)]" />
            <h3 className="font-bold text-[var(--on-surface)]">Email</h3>
            <p className="text-sm text-[var(--on-surface-variant)]">support@localloop.in</p>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--surface-container)] flex flex-col items-center text-center gap-3">
            <PhoneCall className="w-8 h-8 text-[var(--primary)]" />
            <h3 className="font-bold text-[var(--on-surface)]">Hotline</h3>
            <p className="text-sm text-[var(--on-surface-variant)]">1800-LOCAL-LOOP</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]">
                <h4 className="font-bold text-lg text-[var(--on-surface)] mb-2">{faq.q}</h4>
                <p className="text-[var(--on-surface-variant)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
