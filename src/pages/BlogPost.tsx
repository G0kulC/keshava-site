import { ArrowLeft } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { BlurFade } from '@/components/ui/blur-fade'
import { site } from '@/config/site'
import { getPost, posts } from '@/data'
import { formatDate } from '@/lib/format'
import { waLink } from '@/lib/whatsapp'
import NotFound from '@/pages/NotFound'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = getPost(slug)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  if (!post) return <NotFound />
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <article>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-marigold" />
      <div className="container-page max-w-3xl py-10 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All articles
        </Link>
        <BlurFade>
          <p className="mt-6 text-sm text-muted-foreground">{formatDate(post.date)}</p>
          <h1 className="mt-2 text-4xl font-semibold text-balance text-brand-900 md:text-5xl">{post.title}</h1>
        </BlurFade>
        {post.cover && <img src={post.cover} alt="" className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover" />}
        {/* Sanitised HTML from our own blog export (whitelisted tags only). */}
        <div className="prose-kf mt-10 text-base md:text-[17px]" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Have a question about your order?</p>
            <p className="text-sm text-muted-foreground">Get expert advice and a quote in minutes.</p>
          </div>
          <a href={waLink(`Hello ${site.name}! I read "${post.title}" and have a question.`)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white">
            <WhatsAppIcon className="size-4" /> Ask us
          </a>
        </div>
      </div>

      <section className="container-page border-t border-border py-12">
        <h2 className="text-2xl font-semibold">Keep reading</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {more.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">{p.cover && <img src={p.cover} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-105" />}</div>
              <h3 className="mt-3 font-sans font-semibold group-hover:text-brand-700">{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
