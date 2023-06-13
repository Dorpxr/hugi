import { heroBlurbText } from '@/data/hero-blurb'
import Link from './Link'

export const HeroBlurb = () => {
  return (
    <div className="flex flex-col py-12 md:flex-row">
      <div className="w-full overflow-hidden rounded-lg bg-neutral-300 p-12 md:w-5/12">
        <img src="/static/images/hero-blurb.jpg" />
      </div>
      <div className="w-full pt-6 md:w-7/12 md:pt-0 md:pl-28">
        <h2 className="pb-8 text-2xl font-bold">{heroBlurbText.header}</h2>
        <p className="pb-8 text-sm">{heroBlurbText.body}</p>
        <Link href={`/about`} className="font-bold text-gray-900 dark:text-gray-100">
          {'More About Me ->'}
        </Link>
      </div>
    </div>
  )
}
