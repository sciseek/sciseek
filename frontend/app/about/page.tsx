import PageShell from "../(marketing)/page-shell";

export default function AboutPage() {
  return (
    <PageShell
      title="About SciSeek"
      subtitle="A cleaner way to explore science questions with structured, evidence-based answers."
    >
      <>
        <p>
          SciSeek is built for people who want more than quick takes and vague
          summaries. It is designed to help users explore science with answers
          that are structured, readable, and grounded in sources.
        </p>

        <p>
          Instead of returning a wall of text, SciSeek organizes answers into a
          clear hook, summary, sections, key points, related questions, and
          citations when available.
        </p>

        <p>
          The goal is simple: make science easier to explore, easier to
          understand, and more satisfying to keep learning.
        </p>
      </>
    </PageShell>
  );
}