export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--on-background)]">
            Privacy Policy
          </h1>
          <p className="text-[var(--on-surface-variant)]">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-p:text-[var(--on-surface-variant)] prose-headings:text-[var(--on-surface)]">
          <p>
            At LocalLoop, your privacy is our core engineering mandate. We only extract the information necessary to successfully execute hyper-local commerce logistics.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">Data We Collect</h3>
          <ul className="list-disc pl-5 space-y-2 text-[var(--on-surface-variant)]">
            <li><strong>Identity:</strong> Name, Email, Contact Details.</li>
            <li><strong>Location:</strong> Geospatial coordinates for routing delivery agents and filtering nearby partners.</li>
            <li><strong>Transactional:</strong> Encrypted payment hashes and order history logic.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4">How We Use Data</h3>
          <p>
            Your spatial data is ephemeral and strictly used to compute route matrices. We do NOT sell identifiable data to third-party ad networks.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">Data Persistence & Erasure</h3>
          <p>
            In compliance with spatial network guidelines, you maintain absolute sovereignty over your presence on the LocalLoop. You can execute a hard-delete matrix command from your profile to scrub all traces.
          </p>
        </div>

      </div>
    </div>
  );
}
