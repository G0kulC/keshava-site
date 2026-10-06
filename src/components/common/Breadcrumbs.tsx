import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Visible breadcrumb trail (matches the BreadcrumbList JSON-LD). */
export function Breadcrumbs({ items }: { items: [label: string, to?: string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map(([label, to]) => (
          <li key={label} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" aria-hidden />
            {to ? (
              <Link to={to} className="hover:text-foreground">
                {label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground/80">
                {label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
