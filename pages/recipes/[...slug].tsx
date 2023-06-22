import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import { databaseId, notionClient } from '@/lib/notion/client'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { processContent } from '@/lib/mdx'
import { NotionToMarkdown } from 'notion-to-md'
import { getDatabase, getPage, pageToMetaData } from '@/lib/notion/operations'
import path from 'path'
import { readFileSync } from 'fs'
import matter from 'gray-matter'
import { Author } from '@/lib/types/author.interface'
import { generateSitemap } from '@/lib/generate-sitemap'

const DEFAULT_LAYOUT = 'PostLayout'

const n2m = new NotionToMarkdown({ notionClient })

export const getStaticPaths: GetStaticPaths = async () => {
  const results = await getDatabase(databaseId)
  await generateSitemap()

  return {
    paths: results.map((page) => ({
      params: {
        slug: page.properties.Post.title.map(
          (slug) => slug.plain_text.replace(/ /g, '-') + '-' + page.id.replaceAll('-', '')
        ),
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const pageId = slug.toString().split('-').pop()
  const page = await getPage(pageId)
  const content = await n2m.pageToMarkdown(pageId)
  const contentString = await n2m.toMarkdownString(content)
  const processedContent = await processContent(contentString)
  const pageMetaData = pageToMetaData(slug[0], page)
  const filePath = path.join(process.cwd(), 'data', 'authors', 'default.md')
  const source = readFileSync(filePath, 'utf-8').toString()
  const { data: authorDetails } = matter(source) as unknown as { data: Author }

  return {
    props: {
      content: processedContent.mdxSource,
      authorDetails: [authorDetails],
      ...pageMetaData,
    },
    revalidate: 2700, // 45 minute revalidation to avoid 1 hour notion image expiry
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
  cookTime,
  prepTime,
  totalTime,
  summary,
  featureImage,
  lastModifiedAt,
  servings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {status !== 'Draft' ? (
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
            cookTime,
            prepTime,
            totalTime,
            summary,
            featureImage,
            servings,
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
