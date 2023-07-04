import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { databaseId } from '@/lib/notion/client'
import Card from '@/components/Card'
import { HeroBlurb } from '@/components/HeroBlurb'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Featured } from '@/components/Featured'
import { getPopularStories } from '@/lib/stories/popular'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'

const MAX_DISPLAY = 3

type Props = {
  latestStories: PageMetaData[]
  featuredStory: PageMetaData
  popularStories: PageMetaData[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${DEFAULT_CACHE_CONTROL.maxAge}, stale-while-revalidate=${DEFAULT_CACHE_CONTROL.swr}`
  )

  const [latestRecipes, popularStories] = await Promise.all([
    getAllPostsFrontMatter(databaseId),
    getPopularStories(),
  ])

  const featuredStory = latestRecipes.find((story) => story.featured === true)

  return { props: { latestStories: latestRecipes, featuredStory, popularStories } }
}

export default function Home({
  latestStories,
  featuredStory,
  popularStories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div>
        <HeroBlurb />
        {featuredStory ? (
          <Featured
            image={{ src: featuredStory.featureImage, alt: featuredStory.title }}
            title={featuredStory.title}
            summary={featuredStory.summary}
            href={'/stories/' + featuredStory.slug}
          />
        ) : null}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
              Latest
            </h1>
          </div>
          {latestStories?.length > MAX_DISPLAY && (
            <div className="flex self-end text-base font-medium leading-6">
              <Link
                href="/stories"
                className="text-primary-600 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="all posts"
              >
                All Stories &rarr;
              </Link>
            </div>
          )}
        </div>
        <div>
          <ul className="flex overflow-x-scroll pt-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-x-auto">
            {!latestStories?.length && 'No latest stories found.'}
            {latestStories?.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, title, featureImage, tags } = post
              return (
                <li key={slug} className="min-w-[70%] pr-4 sm:min-w-0 sm:pr-0 md:w-full">
                  <article className="h-full">
                    <Card
                      title={title}
                      imgSrc={featureImage}
                      href={`/stories/${slug}`}
                      tags={tags}
                    />
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
        {siteMetadata.featureFlags.popularStoriesCarousel ? (
          <div className="pt-12">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
              Most Popular
            </h1>
            <ul className="flex overflow-x-scroll pt-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-x-auto">
              {!popularStories?.length && 'No popular stories found.'}
              {popularStories?.slice(0, MAX_DISPLAY).map((post) => {
                const { slug, title, featureImage, tags } = post
                return (
                  <li key={slug} className="min-w-[70%] pr-4 sm:min-w-0 sm:pr-0 md:w-full">
                    <article className="h-full">
                      <Card
                        title={title}
                        imgSrc={featureImage}
                        href={`/stories/${slug}`}
                        tags={tags}
                      />
                    </article>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  )
}
