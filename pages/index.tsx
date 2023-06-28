import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { databaseId } from '@/lib/notion/client'
import Card from '@/components/Card'
import { HeroBlurb } from '@/components/HeroBlurb'
import { PageMetaData } from '@/lib/recipes/interfaces/recipe-metadata.interface'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Featured } from '@/components/Featured'
// import { getPopularRecipes } from '@/lib/recipes/popular'

const MAX_DISPLAY = 3

type Props = {
  latestStories: PageMetaData[]
  featuredStory: PageMetaData
  // popularRecipes: PageMetaData[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=3300')

  const [latestRecipes /*popularRecipes*/] = await Promise.all([
    getAllPostsFrontMatter(databaseId),
    // getPopularRecipes(),
  ])

  const featuredStory = latestRecipes.find((story) => story.featured === true)

  return { props: { latestStories: latestRecipes, featuredStory /*popularRecipes*/ } }
}

export default function Home({
  latestStories,
  featuredStory,
}: // popularRecipes,
InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            {/* <p className="hidden text-lg leading-7 text-gray-500 dark:text-gray-400 md:block">
              {siteMetadata.description}
            </p> */}
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

        {/* <div>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl md:leading-14">
            Popular Recipes
          </h1>
          <ul className="flex overflow-x-scroll pt-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-x-auto">
            {!popularRecipes?.length && 'No popular recipes found.'}
            {popularRecipes?.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, title, featureImage, tags, totalTime } = post
              return (
                <li key={slug} className="min-w-[70%] pr-4 sm:min-w-0 sm:pr-0 md:w-full">
                  <article className="h-full">
                    <Card
                      title={title}
                      imgSrc={featureImage}
                      href={`${slug}`}
                      tags={tags}
                      time={totalTime}
                    />
                  </article>
                </li>
              )
            })}
          </ul>
        </div> */}
      </div>
    </>
  )
}
