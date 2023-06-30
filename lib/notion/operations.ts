import { StoriesDatabase } from '@/lib/notion/interfaces/storiesDatabase.interface'
import { notionClient } from './client'
import fs from 'fs'
import { PageMetaData } from '../stories/interfaces/page-metadata.interface'

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getDatabase(
  id: string,
  options?: {
    filter?: any
    sorts?: any[]
    startCursor?: string
    pageSize?: number
  }
): Promise<StoriesDatabase[]> {
  const { filter, sorts, startCursor, pageSize } = options ?? {}
  const response = await notionClient.databases.query({
    database_id: id,
    filter,
    sorts,
    start_cursor: startCursor,
    page_size: pageSize,
  })
  const results = response.results as StoriesDatabase[]
  if (process.env.DEBUG === 'true') {
    fs.writeFileSync('mocks/storiesDatabase.json', JSON.stringify(results, null, 2)) // write data to file for debugging
  }
  return results
}

export async function getPage(id: string): Promise<StoriesDatabase> {
  const response = await notionClient.pages.retrieve({
    page_id: id,
  })
  const results = response as StoriesDatabase
  if (process.env.DEBUG === 'true') {
    fs.writeFileSync('mocks/storiesPage.json', JSON.stringify(results, null, 2))
  }
  return results
}

export async function getAllPostsFrontMatter(databaseId: string): Promise<PageMetaData[]> {
  const database = await getDatabase(databaseId)

  const allFrontMatter: PageMetaData[] = []

  for (const page of database) {
    if (page.properties.Status.status.name === 'Done') {
      const slug =
        page.properties.Story.title[0].plain_text.replace(/ /g, '-') +
        '-' +
        page.id.replaceAll('-', '')
      const metaData = pageToMetaData(slug, page)
      allFrontMatter.push(metaData)
    }
  }

  const sortedFrontMatter = allFrontMatter.sort((a, b) => dateSortDesc(a.createdAt, b.createdAt))
  if (process.env.DEBUG === 'true') {
    fs.writeFileSync('mocks/storiesFrontMatter.json', JSON.stringify(sortedFrontMatter, null, 2))
  }
  return sortedFrontMatter
}

export function pageToMetaData(slug: string, page: StoriesDatabase): PageMetaData {
  let title = slug.toString().split('-').slice(0, -1).join(' ')
  if (slug.includes('/recipes/')) {
    title = slug.toString().split('/')[2].split('-').slice(0, -1).join(' ')
  }

  return {
    slug,
    title,
    tags: page.properties.Tags.multi_select.map((tag) => tag.name),
    createdAt: page.created_time.split('T')[0].toString(),
    status: page.properties.Status.status.name,
    summary: page.properties.Summary.rich_text[0].text.content,
    featureImage: page.properties?.FeatureImage?.files[0]?.file?.url ?? '/static/banner.jpeg',
    lastModifiedAt: page.last_edited_time.split('T')[0].toString(),
    featured: page.properties.Featured.checkbox,
  }
}

export function slugFromPage(page: StoriesDatabase, subPath?: string) {
  const slug = '/' + page.url.toString().split('/')[2]
  return subPath ? subPath + slug : slug
}
