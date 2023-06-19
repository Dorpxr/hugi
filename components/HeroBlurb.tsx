import { heroBlurbText } from '@/data/hero-blurb'
import Link from './Link'
import Image from 'next/image'

export const HeroBlurb = () => {
  return (
    <div className="flex flex-col py-12 md:flex-row">
      <div className="w-full overflow-hidden rounded-lg bg-neutral-300 p-12 md:w-5/12">
        <div className="relative">
          <Image
            src={'/static/images/hero-blurb.png'}
            width={500}
            height={500}
            alt={'Anna Skryd Image'}
          />
        </div>
      </div>
      <div className="w-full pt-6 md:w-7/12 md:pt-0 md:pl-28">
        <h2 className="pb-8 text-2xl font-bold">{heroBlurbText.header}</h2>
        <p className="pb-8 text-sm">{heroBlurbText.body}</p>
        <Link href={`/about`} className="font-bold text-primary-700 dark:text-primary-400">
          {'More About Me ->'}
        </Link>
      </div>
    </div>
  )
}
