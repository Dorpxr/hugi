import Link from './Link'

export interface SubLink {
  text: string
  href: string
}

type Props = {
  subLinks: SubLink[]
}

export const LinkSubnav = ({ subLinks }: Props) => {
  return (
    <div className="absolute right-0 z-30 mt-[15px] hidden w-64 rounded-b-lg rounded-tl-lg border-gray-400 bg-white p-4 group-hover:block group-hover:border dark:group-hover:bg-black">
      <h2 className="text-lg font-bold">Genres</h2>
      <ul>
        {subLinks.map((link) => (
          <li key={link.href} className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <Link href={link.href}>{link.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
