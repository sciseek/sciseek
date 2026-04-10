import PageShell from "../(marketing)/page-shell";

export default function StoryPage() {
  return (
    <PageShell
      title="The SciSeek Story"
      subtitle="Why this project exists."
    >
      <>
        <p>
          SciSeek started from a simple frustration: most answers online are
          either too shallow, too messy, or too hard to trust.
        </p>

        <p>
          Science is one of the most fascinating subjects in the world, but good
          explanations are often buried under clutter, opinions, and content
          written for clicks instead of clarity.
        </p>

        <p>
          SciSeek is an attempt to build something cleaner: a place where curious
          people can ask science questions and get answers that feel organized,
          thoughtful, and grounded.
        </p>

        <p>
          This is still an early version, but the vision is clear: make science
          exploration feel beautiful, trustworthy, and genuinely useful.
        </p>
      </>
    </PageShell>
  );
}