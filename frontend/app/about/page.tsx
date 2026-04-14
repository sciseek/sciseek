import PageShell from "../(marketing)/page-shell";

export default function AboutPage() {
  return (
    <PageShell
      title="What is SciSeek?"
      subtitle="A smarter way to explore and understand science."
    >
      <>
        <p>
          SciSeek is built for people who are curious about how the world works — 
          but want answers that are clear, structured, and actually make sense.
        </p>

        <p>
          Instead of overwhelming you with dense explanations or vague summaries, 
          SciSeek gives you a clean, layered answer:
          a clear starting point, key ideas, and deeper context when you need it.
        </p>

        <p>
          The goal isn’t just to answer questions — it’s to help you understand them.
        </p>

        <p>
          SciSeek is designed to support curiosity at different levels:
        </p>

        <ul>
          <li>Quick, structured answers to scientific questions</li>
          <li>Simple explanations when a topic feels confusing</li>
          <li>Deeper exploration when you want to go further</li>
        </ul>

        <p>
          During this soft launch, you’ll see early versions of upcoming features:
        </p>

        <ul>
          <li><strong>Explain This</strong> — paste complex text and get a clear explanation</li>
          <li><strong>Fact Check Mode</strong> — evaluate claims using scientific reasoning</li>
        </ul>

        <p>
          SciSeek is evolving into a tool for exploring ideas, not just searching for answers.
        </p>
      </>
    </PageShell>
  );
}