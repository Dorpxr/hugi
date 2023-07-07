import { NotionToMarkdown } from 'notion-to-md'
import { processContent } from '../mdx'
import { notionClient } from '../notion/client'
import { getPage, pageToMetaData } from '../notion/operations'

const n2m = new NotionToMarkdown({ notionClient })

export const parseStoryPage = async (pageId: string) => {
  const page = await getPage(pageId)
  const content = await n2m.pageToMarkdown(pageId)
  const contentString = await n2m.toMarkdownString(content)
  const processedContent = await processContent(contentString)
  const pageMetaData = pageToMetaData(page)

  return {
    content: processedContent.mdxSource,
    pageMetaData: pageMetaData,
  }
}
