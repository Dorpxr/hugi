import Link from '@/components/Link'
import Pagination from '@/components/Pagination'
import { PageMetaData } from '@/lib/notion/interfaces/recipePageMetaData.interface'

interface Props {
  posts: PageMetaData[]
  initialDisplayPosts?: PageMetaData[]
  pagination?: {
    currentPage: number
    totalPages: number
  }
}

const chunkedPosts = (posts: PageMetaData[], chunkSize: number) => {
  const chunkedArray: PageMetaData[][] = []
  for (let i = 0; i < posts.length; i += chunkSize) {
    chunkedArray.push([...posts.slice(i, i + chunkSize)])
  }
  return chunkedArray
}

export default function ReelLinksLayout({ posts, initialDisplayPosts = [], pagination }: Props) {
  const chunkedPostsArray = chunkedPosts(posts, 3)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <article>
          {!chunkedPostsArray.length && 'No recipes found.'}
          {chunkedPostsArray.map((chunkedPosts, index) => {
            return (
              <div key={index} className="flex flex-row py-1">
                {chunkedPosts.map((frontMatter) => {
                  const { slug, reelImage } = frontMatter
                  return (
                    <div key={slug} className="aspect-4/3 w-1/3 px-1">
                      <Link href={`/recipes/${slug}`}>
                        <img src={reelImage} className="h-full"></img>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </article>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
