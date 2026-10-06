import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { BlurFade } from '@/components/ui/blur-fade'
import { posts } from '@/data'
import { formatDate } from '@/lib/format'

export default function Blog() {
  const [lead, ...rest] = posts
  return (
    <>
      <PageHero eyebrow="Blog & guides" title="Know your bags" description="Practical guides on GSM, bag types, printing and packaging — so you order with confidence." />
      <section className="container-page py-12">
        {lead && (
          <BlurFade>
            <Link to={`/blog/${lead.slug}`} className="group grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden bg-muted md:aspect-auto">
                {lead.cover && <img src={lead.cover} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-xs text-muted-foreground">{formatDate(lead.date)} · Latest</p>
                <h2 className="mt-2 text-3xl font-semibold group-hover:text-brand-700">{lead.title}</h2>
                <p className="mt-3 text-muted-foreground">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Read article <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </BlurFade>
        )}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <BlurFade key={p.slug} inView delay={i * 0.05}>
              <Link to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {p.cover && <img src={p.cover} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{formatDate(p.date)}</p>
                <h3 className="mt-1 text-xl font-semibold group-hover:text-brand-700">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  )
}
