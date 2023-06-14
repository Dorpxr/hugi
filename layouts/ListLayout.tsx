import { useState } from 'react'
import Pagination from '@/components/Pagination'
import { PageMetaData } from '@/lib/notion/interfaces/recipePageMetaData.interface'
import Card from '@/components/Card'

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
      <div>
        <div className="border-b border-neutral-400 pb-6 dark:border-neutral-300">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
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
        <ul className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3">
          {!filteredBlogPosts.length && 'No recipes found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, title, tags, featureImage, cookTime } = frontMatter
            return (
              <li key={slug} className="w-full">
                <article className="h-full">
                  <Card
                    title={title}
                    imgSrc={featureImage}
                    href={`/recipes/${slug}`}
                    tags={tags}
                    cookTime={cookTime}
                  />
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
