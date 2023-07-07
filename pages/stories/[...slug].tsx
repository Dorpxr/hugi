import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAuthorDetails } from '@/lib/author/details'
import { parseStoryPage } from '@/lib/stories/parse-page'
import { databaseId } from '@/lib/notion/client'
import { getDatabase } from '@/lib/notion/operations'

const DEFAULT_LAYOUT = 'PostLayout'

export const getStaticPaths: GetStaticPaths = async () => {
  const results = await getDatabase(databaseId)

  return {
    paths: results.map((page) => ({
      params: {
        slug: [page.url.replace('https://www.notion.so/', '')],
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const pageId = slug.toString().split('-').pop()
  const [parsedPage, authorDetails] = await Promise.all([
    parseStoryPage(pageId),
    getAuthorDetails(),
  ])
  const { content, pageMetaData } = parsedPage

  return {
    props: {
      content,
      authorDetails: [authorDetails],
      ...pageMetaData,
    },
  }
}

export default function Recipe({
  content,
  slug,
  authorDetails,
  title,
  tags,
  createdAt,
  status,
  summary,
  featureImage,
  lastModifiedAt,
  featured,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {status === 'Done' ? (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          mdxSource={content}
          pageMetaData={{
            slug,
            createdAt,
            lastModifiedAt,
            title,
            tags,
            status,
            summary,
            featureImage,
            featured,
          }}
          authorDetails={authorDetails}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
