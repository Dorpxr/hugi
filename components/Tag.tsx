import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link legacyBehavior href={`/genres/${kebabCase(text)}`}>
      <a className="my-1 mr-2 rounded-md bg-primary-700 py-1 px-2 text-sm font-medium capitalize text-white hover:bg-primary-600 dark:hover:bg-primary-400">
        {text}
      </a>
    </Link>
  )
}

export default Tag
