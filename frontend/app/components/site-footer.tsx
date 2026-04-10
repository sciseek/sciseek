import Link from "next/link";
import SciSeekLogo from "../components/sciseek-logo";

<SciSeekLogo />

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SciSeekLogo className="h-12 w-12" />
          <div>
            <div className="text-xl font-medium text-white/85"><h1 className="logo-wordmark">Sci<span>Seek</span></h1></div>
            <div className="text-xs">
              Structured science answers for curious minds.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link href="/story" className="transition hover:text-white">
            SciSeek Story
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}