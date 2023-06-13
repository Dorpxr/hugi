import { formatTime } from '@/lib/utils/formatTime'
import Link from './Link'
import Tag from './Tag'
import AppIcon from './app-icons'

const Card = ({ title, imgSrc, href, tags, cookTime }) => (
  <div className="overflow-hidden rounded-lg">
    <img src={imgSrc} />
    <div className="flex h-24 flex-col justify-between rounded-b-lg border border-gray-400 px-3 pb-2 pt-1 dark:border-gray-600">
      <h3 className="text-sm font-bold md:text-lg">
        <Link href={`${href}`} className="text-gray-900 dark:text-gray-100">
          {title}
        </Link>
      </h3>
      <div className="flex justify-between">
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <div className="flex text-gray-500 dark:text-gray-400">
          <AppIcon kind="clock" size={5} />
          <p className="pl-1 text-sm uppercase">{formatTime(cookTime)}</p>
        </div>
      </div>
    </div>
  </div>
)

export default Card
