import Link from "next/link";

export default function SciSeekLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 shadow-[0_0_20px_rgba(96,165,250,0.12)] ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-[95%] w-[95%]"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="4.5" fill="var(--primary)" />
        <ellipse
          cx="32"
          cy="32"
          rx="21"
          ry="10"
          stroke="var(--primary)"
          strokeWidth="1.4"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="21"
          ry="10"
          transform="rotate(60 32 32)"
          stroke="var(--primary)"
          strokeWidth="1.4"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="21"
          ry="10"
          transform="rotate(-60 32 32)"
          stroke="var(--primary)"
          strokeWidth="1.4"
        />
        <circle cx="43" cy="14" r="2.5" fill="orange" />	
      </svg>	
    </div>
  );
}