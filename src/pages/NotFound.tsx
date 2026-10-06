import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-28 text-center">
      <p className="font-heading text-8xl font-semibold text-brand-600/20">404</p>
      <h1 className="mt-4 text-3xl font-semibold">This page wandered off</h1>
      <p className="mt-2 text-muted-foreground">The link may be old. Let's get you back to the bags.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white">
          Go home
        </Link>
        <Link to="/shop" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">
          Browse shop
        </Link>
      </div>
    </section>
  )
}
