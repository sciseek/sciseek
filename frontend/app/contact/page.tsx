import PageShell from "../(marketing)/page-shell";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      subtitle="Questions, feedback, or partnership inquiries."
    >
      <>
        <p>
          SciSeek is currently in an early stage, and feedback is especially
          valuable.
        </p>

        <p>
          For general questions, product feedback, or business inquiries, please
          reach out at:
        </p>

        <p>
          <strong>contact@sciseek.com</strong>
        </p>

        <p>
          If you are reporting a bug or issue, including a short description and
          a screenshot will help a lot.
        </p>
      </>
    </PageShell>
  );
}