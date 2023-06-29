import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAuthorDetails } from '@/lib/author/details'
import { parseStoryPage } from '@/lib/stories/parse-page'

const DEFAULT_LAYOUT = 'PostLayout'

export const getServerSideProps: GetServerSideProps = async ({ params: { slug }, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=3300')
  const pageId = slug.toString().split('-').pop()
  const [parsedPage, authorDetails] = await Promise.all([
    parseStoryPage(pageId, slug[0]),
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
