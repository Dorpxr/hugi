import Link from './Link'
import Image from 'next/image'

type Props = {
  image: {
    src: string
    alt: string
  }
  title: string
  summary: string
  href: string
}

export const Featured = ({ image, title, summary, href }: Props) => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
        Featured
      </h1>
      <div className="flex flex-col pt-3 md:flex-row">
        <div className="w-full overflow-hidden rounded-lg md:w-7/12">
          <div className="relative">
            <Image src={image.src} width={960} height={540} alt={image.alt} />
          </div>
        </div>
        <div className="w-full pt-6 md:w-5/12 md:pt-0 md:pl-16">
          <h2 className="pb-8 text-2xl font-bold">{title}</h2>
          <p className="pb-8 text-sm">{summary}</p>
          <Link href={href} className="font-bold text-primary-100 dark:text-primary-100">
            <div className="rounded-lg bg-indigo-700 p-4">{'Read Now ->'}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
