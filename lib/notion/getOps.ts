import { RecipesDatabase } from '@/lib/notion/interfaces/recipesDatabase.interface'
import { RecipePage } from '@/lib/notion/interfaces/recipePage.interface'
import { notionClient } from './client'
import fs from 'fs'
import { PageMetaData } from './interfaces/recipePageMetaData.interface'

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getDatabase(id: string): Promise<RecipesDatabase[]> {
  const response = await notionClient.databases.query({
    database_id: id,
  })
  const results = response.results as RecipesDatabase[]
  return results
}

export async function getPage(id: string): Promise<RecipePage> {
  const response = await notionClient.pages.retrieve({
    page_id: id,
  })
  const results = response as RecipePage
  return results
}

export async function getAllPostsFrontMatter(databaseId: string): Promise<PageMetaData[]> {
  const database = await getDatabase(databaseId)

  const allFrontMatter: PageMetaData[] = []

  for (const page of database) {
    if (page.properties.Status.status.name !== 'Draft') {
      const slug =
        page.properties.Post.title[0].plain_text.replace(/ /g, '-') +
        '-' +
        page.id.replaceAll('-', '')
      const metaData = pageToMetaData(slug, page)
      allFrontMatter.push(metaData)
    }
  }

  const sortedFrontMatter = allFrontMatter.sort((a, b) => dateSortDesc(a.createdAt, b.createdAt))
  return sortedFrontMatter
}

export function pageToMetaData(slug: string, page: RecipePage): PageMetaData {
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
    cookTime: page.properties.CookTime.number,
    summary: page.properties.Summary.rich_text[0].text.content,
    featureImage: page.properties?.FeatureImage?.files[0]?.file?.url ?? '/static/banner.jpeg',
    lastModifiedAt: page.last_edited_time.split('T')[0].toString(),
  }
}
