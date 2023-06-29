import Link from './Link'
import { LinkSubnav, SubLink } from './LinkSubnav'

type Props = {
  text: string
  href: string
  subLinks?: SubLink[]
}

export const TopNavLink = (context: Props) => {
  return (
    <li className="group relative">
      <Link
        href={context.href}
        className={`relative z-40 rounded-t-lg p-1 font-medium text-gray-900 ${
          context.subLinks
            ? 'group-hover:border-t group-hover:border-l group-hover:border-r group-hover:border-gray-400 group-hover:bg-white dark:group-hover:bg-black'
            : null
        } dark:text-gray-100 sm:p-4`}
      >
        {context.text}
      </Link>
      {context.subLinks ? <LinkSubnav subLinks={context.subLinks} /> : null}
    </li>
  )
}
