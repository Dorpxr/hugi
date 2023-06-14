import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link legacyBehavior href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 rounded-md bg-primary-600 p-1 text-sm font-medium capitalize text-white hover:bg-primary-600 dark:hover:bg-primary-400">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
