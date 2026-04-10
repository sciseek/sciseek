import PageShell from "../(marketing)/page-shell";

export default function TermsPage() {
  return (
    <PageShell
      title="Terms & Conditions"
      subtitle="Basic terms for using SciSeek."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p className="mt-2">
            SciSeek is provided for informational and educational purposes. While we
            aim to make answers useful and well-structured, no response should be
            treated as professional medical, legal, financial, or other regulated
            advice.
          </p>
        </section>
    
        <section>
          <h2 className="text-lg font-semibold text-white">Acceptable Use</h2>
          <p className="mt-2">
            You agree not to misuse the service, attempt to disrupt the platform, or
            use SciSeek for unlawful purposes.
          </p>
        </section>
    
        <section>
          <h2 className="text-lg font-semibold text-white">Service Changes</h2>
          <p className="mt-2">
            SciSeek may update, change, or remove features at any time, especially
            during early development.
          </p>
        </section>
    
        <section>
          <h2 className="text-lg font-semibold text-white">Acceptance</h2>
          <p className="mt-2">
            Continued use of the service means you accept the current version of
            these terms.
          </p>
        </section>
      </div>
    </PageShell>
  );
}