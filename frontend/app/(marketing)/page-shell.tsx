import Link from "next/link";
import SiteFooter from "../components/site-footer";
import SciSeekLogo from "../components/sciseek-logo";
import { GoogleAnalytics } from '@next/third-parties/google'

<SciSeekLogo />

type PageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function PageShell({
  title,
  subtitle,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <SciSeekLogo className="h-15 w-15" />
            <div className="min-w-0">
              <div className="text-xl font-semibold tracking-tight text-white sm:text-3xl">
                <h1 className="logo-wordmark">Sci<span>Seek</span></h1>
              </div>
              <div className="text-xs text-[var(--muted)] sm:text-sm">
                Search smarter. Understand deeper.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              About
            </Link>
            <Link
              href="/story"
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Story
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_0_0_1px_rgba(96,165,250,0.04),0_10px_30px_rgba(0,0,0,0.18)]">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-3 max-w-2xl text-[var(--muted)]">{subtitle}</p>
          ) : null}
         
          <div className="mt-8">
            <div className="space-y-5 text-[var(--foreground)] leading-7">
              {children}
            </div>
          </div>
        </div>
      </main>
	  
	  <SiteFooter />
	  
    </div><GoogleAnalytics gaId="G-S8HY1NX2BR" />
  );
}
