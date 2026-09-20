import { profile, site } from '../data/content'

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-paper px-6 md:px-10">
      <a href="#top" className="text-lg font-semibold tracking-tight text-ink">
        {profile.name}
      </a>
      <nav aria-label="Primary">
        <ul className="flex items-center gap-7 text-[16px] text-ink-soft">
          {site.nav.map((n) => (
            <li key={n.href}>
              <a className="transition-colors hover:text-ink" href={n.href}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
