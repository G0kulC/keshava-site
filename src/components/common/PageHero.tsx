import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

interface Props {
  eyebrow: string
  title: string
  description?: string
  children?: React.ReactNode
  /** Optional right-hand visual (image, animation…). */
  aside?: React.ReactNode
}

export function PageHero({ eyebrow, title, description, children, aside }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-brand-50/80 to-background">
      <DotPattern className="text-brand-600/20 [mask-image:radial-gradient(500px_circle_at_80%_30%,white,transparent)]" />
      <div className={cn('container-page relative py-14 md:py-20', aside && 'grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:py-16')}>
        <BlurFade>
          <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-balance text-brand-900 md:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">{description}</p>}
          {children}
        </BlurFade>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </section>
  )
}
