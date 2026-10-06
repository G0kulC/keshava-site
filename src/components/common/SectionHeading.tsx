import { BlurFade } from '@/components/ui/blur-fade'
import { cn } from '@/lib/utils'

interface Props {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  action?: React.ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', action, className }: Props) {
  return (
    <BlurFade inView className={cn('mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', align === 'center' && 'md:flex-col md:items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">
            <span className="h-px w-6 bg-marigold" /> {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold text-balance text-brand-900 md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{title}</h2>
        {description && <p className="mt-4 text-base text-pretty text-muted-foreground md:text-lg">{description}</p>}
      </div>
      {action}
    </BlurFade>
  )
}
