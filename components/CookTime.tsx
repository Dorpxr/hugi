import { formatTime } from '@/lib/utils/formatTime'
import AppIcon from './app-icons'

type Props = {
  prepTime: number
  cookTime: number
  totalTime: number
}

export const CookTime = ({ prepTime, cookTime, totalTime }: Props) => {
  return (
    <dl className="flex justify-evenly py-10 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
      <div>
        <dt className="text-center text-sm text-black dark:text-white">Prep Time</dt>
        <dd className="flex items-center justify-center self-center uppercase">
          <AppIcon kind="clock" size={5} />
          <span className="pl-1">{formatTime(prepTime)}</span>
        </dd>
      </div>
      <div>
        <dt className="text-center text-sm text-black dark:text-white">Cook Time</dt>
        <dd className="flex items-center justify-center self-center uppercase">
          <AppIcon kind="clock" size={5} />
          <span className="pl-1">{formatTime(cookTime)}</span>
        </dd>
      </div>
      <div>
        <dt className="text-center text-sm text-black dark:text-white">Total Time</dt>
        <dd className="flex items-center justify-center self-center uppercase">
          <AppIcon kind="clock" size={5} />
          <span className="pl-1">{formatTime(totalTime)}</span>
        </dd>
      </div>
    </dl>
  )
}
