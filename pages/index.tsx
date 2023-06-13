import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'

import { getAllPostsFrontMatter } from '@/lib/notion/getOps'
import { databaseId } from '@/lib/notion/client'
import Card from '@/components/Card'
import AppIcon from '@/components/app-icons'
import { formatTime } from '@/lib/utils/formatTime'
import tags from './tags'

const MAX_DISPLAY = 3

export async function getStaticProps() {
  const posts = await getAllPostsFrontMatter(databaseId)

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="flex flex-wrap pt-6">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, title, summary, featureImage, tags, cookTime } = frontMatter
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
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
