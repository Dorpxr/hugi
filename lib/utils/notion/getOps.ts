import { RecipesDatabase } from '@/lib/utils/notion/interfaces/recipesDatabase.interface'
import { RecipePage } from '@/lib/utils/notion/interfaces/recipePage.interface'
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
  // write data to file for debugging
  fs.writeFileSync('mocks/recipesDatabase.json', JSON.stringify(results, null, 2))
  return results
}

export async function getPage(id: string): Promise<RecipePage> {
  const response = await notionClient.pages.retrieve({
    page_id: id,
  })
  const results = response as RecipePage
  // write data to file for debugging
  fs.writeFileSync('mocks/recipesPage.json', JSON.stringify(results, null, 2))
  return results
}

export async function getAllPostsFrontMatter(databaseId: string): Promise<PageMetaData[]> {
  const database = await getDatabase(databaseId)

  const allFrontMatter: PageMetaData[] = []

  for (const page of database) {
    if (page.properties.Status.status.name !== 'Draft') {
      allFrontMatter.push({
        title: page.properties.Post.title[0].plain_text,
        createdAt: page.created_time.split('T')[0].toString(),
        slug:
          page.properties.Post.title[0].plain_text.replace(/ /g, '-') +
          '-' +
          page.id.replaceAll('-', ''),
        tags: page.properties.Tags.multi_select.map((tag) => tag.name),
        status: page.properties.Status.status.name,
      })
    }
  }

  const sortedFrontMatter = allFrontMatter.sort((a, b) => dateSortDesc(a.createdAt, b.createdAt))
  // write data to file for debugging
  fs.writeFileSync('mocks/recipesFrontMatter.json', JSON.stringify(sortedFrontMatter, null, 2))
  return sortedFrontMatter
}
