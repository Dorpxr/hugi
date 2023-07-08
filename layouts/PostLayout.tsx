import React from 'react'
import { Author } from '@/lib/author/interfaces/author.interface'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from 'next/image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTop from '@/components/ScrollTop'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'

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
        url={`${siteMetadata.siteUrl}/recipes/${slug}`}
        authorDetails={authorDetails}
        title={title}
        date={createdAt}
        lastmod={lastModifiedAt}
        summary={summary}
        images={[featureImage]}
      />
      <ScrollTop />
      <article>
        <div>
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="mx-auto flex max-w-xl flex-col divide-y divide-y-0 pb-8">
            <dl className="pt-6 pb-10 xl:pt-0 xl:pb-6 xl:pt-0 xl:dark:border-gray-700"></dl>
            <div className="flex flex-col items-center justify-center xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="relative">
                <Image src={featureImage} width={1024} height={1024} alt={title} />
              </div>
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            </div>
            <footer>
              <div className="divide-gray-300 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-3 xl:py-6">
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
                  href="/stories"
                  className="text-primary-700 hover:text-primary-600 dark:hover:text-primary-300"
                >
                  &larr; Back to stories
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
