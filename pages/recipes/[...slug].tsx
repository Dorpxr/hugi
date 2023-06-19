import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import { databaseId, notionClient } from '@/lib/notion/client'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { processContent } from '@/lib/mdx'
import { NotionToMarkdown } from 'notion-to-md'
import { getDatabase, getPage } from '@/lib/notion/getOps'
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
  const title = slug.toString().split('-').slice(0, -1).join(' ')
  const tags = page.properties.Tags.multi_select.map((tag) => tag.name)
  const createdAt = page.created_time.split('T')[0].toString()
  const status = page.properties.Status.status.name
  const cookTime = page.properties.CookTime
  const summary = page.properties.Summary.rich_text[0].text.content
  const featureImage = page.properties.FeatureImage.files[0].file.url
  const lastModifiedAt = page.last_edited_time.split('T')[0].toString()
  const filePath = path.join(process.cwd(), 'data', 'authors', 'default.md')
  const source = readFileSync(filePath, 'utf-8').toString()
  const { data: authorDetails } = matter(source) as unknown as { data: Author }

  return {
    props: {
      content: processedContent.mdxSource,
      slug,
      authorDetails: [authorDetails],
      title,
      tags,
      createdAt,
      status,
      cookTime,
      summary,
      featureImage,
      lastModifiedAt,
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
  cookTime,
  summary,
  featureImage,
  lastModifiedAt,
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
            summary,
            featureImage,
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
