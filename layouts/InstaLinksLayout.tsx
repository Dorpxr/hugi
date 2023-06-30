import { useState } from 'react'
import Pagination from '@/components/Pagination'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import Card from '@/components/Card'

interface Props {
  initialDisplayPosts?: PageMetaData[]
  pagination?: {
    currentPage: number
    totalPages: number
  }
}

export default function InstaLinksLayout({ initialDisplayPosts = [], pagination }: Props) {
  return (
    <>
      <div>
        <ul className="grid grid-cols-3 gap-4 pt-6">
          {!initialDisplayPosts.length && 'No stories found.'}
          {initialDisplayPosts.map((post) => {
            const { slug, title, tags, featureImage } = post
            return (
              <li key={slug} className="w-full">
                <article className="h-full">
                  <Card
                    title={title}
                    imgSrc={featureImage}
                    href={`/stories/${slug}`}
                    tags={tags}
                    imageOnly
                  />
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          linkBasePath="/insta-links"
        />
      )}
    </>
  )
}
