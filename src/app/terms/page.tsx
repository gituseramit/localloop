export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--on-background)]">
            Terms of Service
          </h1>
          <p className="text-[var(--on-surface-variant)]">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-p:text-[var(--on-surface-variant)] prose-headings:text-[var(--on-surface)]">
          <p>
            Welcome to LocalLoop. By accessing our platform, you agree to these terms of service. 
            LocalLoop acts as a technology intermediary bridging local offline businesses (Partners) with end Customers.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">1. Account Registration</h3>
          <p>
            To utilize LocalLoop as a Partner or Delivery Agent, you must complete the KYC (Know Your Customer) process.
            You are responsible for safeguarding your credentials.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">2. Service Fulfillment</h3>
          <p>
            Partners operate independently. LocalLoop does not guarantee the quality of partner services but enforces strict penalization against systemic failure rates via our Admin framework.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">3. Payment & Escrow</h3>
          <p>
            Funds are held securely in escrow and released to Partners and Delivery Agents only upon verifiable completion of the service mandate.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">4. Limitation of Liability</h3>
          <p>
            LocalLoop is not accountable for indirect or consequential damages resulting from the failure of service nodes.
          </p>
        </div>

      </div>
    </div>
  );
}
