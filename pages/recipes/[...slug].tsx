import { databaseId, notionClient } from '@/lib/notion/client'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { processContent } from '@/lib/mdx'
import { NotionToMarkdown } from 'notion-to-md'
import { getDatabase, getPage } from '@/lib/notion/getOps'

const DEFAULT_LAYOUT = 'PostLayout'

const n2m = new NotionToMarkdown({ notionClient })

export async function getStaticPaths() {
  const results = await getDatabase(databaseId)

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

export async function getStaticProps({ params: { slug } }) {
  const pageId = slug.toString().split('-').pop()

  const page = await getPage(pageId)

  const content = await n2m.pageToMarkdown(pageId)
  const contentString = await n2m.toMarkdownString(content)
  const processedContent = await processContent(contentString)
  const title = slug.toString().split('-').slice(0, -1).join(' ')
  const tags = page.properties.Tags.multi_select.map((tag) => tag.name)
  const createdAt = page.created_time.split('T')[0].toString()
  const status = page.properties.Status.status.name

  return {
    props: {
      content: processedContent.mdxSource,
      slug,
      authorDetails: [{ name: 'Anna Skryd' }],
      title,
      tags,
      createdAt,
      status,
    },
  }
}

export default function Recipe({ content, slug, authorDetails, title, tags, createdAt, status }) {
  return (
    <>
      {status !== 'Draft' ? (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          mdxSource={content}
          frontMatter={{ slug, date: createdAt, title, tags }}
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
