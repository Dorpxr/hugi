import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import { PageMetaData } from '@/lib/notion/interfaces/recipePageMetaData.interface'
import AppIcon from '@/components/app-icons'
import { formatTime } from '@/lib/utils/formatTime'

interface Props {
  posts: PageMetaData[]
  title: string
  initialDisplayPosts?: PageMetaData[]
  pagination?: {
    currentPage: number
    totalPages: number
  }
}

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <input
              aria-label="Search recipes"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search recipes"
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul className="flex flex-wrap pt-6">
          {!filteredBlogPosts.length && 'No recipes found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, title, tags, featureImage, cookTime } = frontMatter
            return (
              <li key={slug} className="w-full md:w-1/3">
                <article className="h-full p-2">
                  <div className="overflow-hidden rounded-lg border border-gray-300 shadow-lg dark:border-gray-600 dark:shadow-gray-700/30">
                    <img src={featureImage} />
                    <div className="flex h-24 flex-col justify-between px-3 pb-2 pt-1">
                      <h3 className="text-lg font-bold leading-8 tracking-tight">
                        <Link
                          href={`/recipes/${slug}`}
                          className="text-gray-900 dark:text-gray-100"
                        >
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
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
