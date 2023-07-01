import { useState } from 'react'
import Pagination from '@/components/Pagination'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import Card from '@/components/Card'
import { useSearchFilters } from 'hooks/useSearchFilters'
import { suggestedFilters } from '@/data/suggestedFilters'
import { useSearch } from 'hooks/useSearch'

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
  const { filters, updateFilter } = useSearchFilters(suggestedFilters)

  const { searchValue, setSearchValue, hasEnabledFilters, filteredBlogPosts } = useSearch({
    filters,
    posts,
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue && hasEnabledFilters.length === 0
      ? initialDisplayPosts
      : filteredBlogPosts

  return (
    <>
      <div>
        <div>
          <h1 className="pb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
            {title}
          </h1>
          <div className="flex flex-col">
            <div className="relative w-full max-w-lg md:w-1/2">
              <input
                aria-label={`Search ${title ? title : 'stories'}`}
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search ${title ? title : 'stories'}`}
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-slate-800 dark:text-gray-400 dark:placeholder:text-gray-400"
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
            <p className="pt-6 text-sm">Filters</p>
            <ul className="flex flex-wrap items-center">
              {filters.map(({ filter, isSelected }) => (
                <li key={filter} className="pr-2 pt-2">
                  <button
                    onClick={() => updateFilter(filter)}
                    className={`rounded-md ${
                      isSelected
                        ? 'bg-slate-200 dark:bg-slate-500'
                        : 'border-gray-300 bg-white dark:bg-slate-800'
                    } border p-2 text-sm capitalize text-gray-600 dark:border-black dark:text-white`}
                  >
                    {filter.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3">
          {!displayPosts.length && 'No stories found.'}
          {displayPosts.map((post) => {
            const { slug, title, tags, featureImage } = post
            return (
              <li key={slug} className="w-full">
                <article className="h-full">
                  <Card title={title} imgSrc={featureImage} href={`/stories/${slug}`} tags={tags} />
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination &&
        pagination.totalPages > 1 &&
        !searchValue &&
        hasEnabledFilters.length === 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            linkBasePath="/stories"
          />
        )}
    </>
  )
}
