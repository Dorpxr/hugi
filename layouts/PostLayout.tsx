import React from 'react'
import { Author } from '@/lib/types/author.interface'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from 'next/image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { PageMetaData } from '@/lib/notion/interfaces/recipePageMetaData.interface'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface Props {
  pageMetaData: PageMetaData
  authorDetails: Author[]
  children: React.ReactNode
}

export default function PostLayout({
  pageMetaData: { slug, createdAt, title, tags, summary, featureImage, lastModifiedAt },
  authorDetails,
  children,
}: Props) {
  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        title={title}
        date={createdAt}
        lastmod={lastModifiedAt}
        summary={summary}
        images={[featureImage]}
      />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width="38px"
                          height="38px"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
              <div className="flex justify-between pt-8 xl:flex-col">
                <div className="xl:pb-6">
                  <dt className="text-center text-sm xl:text-left">Published on</dt>
                  <dd className="pr-1 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 sm:pr-0 sm:text-base">
                    <time dateTime={createdAt}>
                      {new Date(createdAt).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-center text-sm xl:text-left">Updated on</dt>
                  <dd className="pl-1 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 sm:pl-0 sm:text-base">
                    <time dateTime={lastModifiedAt}>
                      {new Date(lastModifiedAt).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="relative pt-6">
                <Image src={featureImage} width={960} height={540} alt={title} />
              </div>
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href="/recipes"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  &larr; Back to recipes
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
