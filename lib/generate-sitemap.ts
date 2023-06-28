import siteMetadata from '@/data/siteMetadata'
import { databaseId } from '../lib/notion/client'
import { getDatabase } from './notion/operations'
import { getAllTags } from './tags'

export const generateSitemap = async () => {
  const pages = ['/', '/stories', '/about']
  const recipes = await getDatabase(databaseId)
  const tags = await getAllTags()

  recipes.forEach((recipe) => {
    const slug = recipe.properties.Story.title.map(
      (slug) => slug.plain_text.replace(/ /g, '-') + '-' + recipe.id.replaceAll('-', '')
    )
    const status = recipe.properties.Status.status.name
    if (status !== 'Draft') {
      pages.push('/stories/' + slug[0])
    }
  })

  Object.keys(tags).forEach((tag) => pages.push('/tags/' + tag))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                // Exclude drafts from the sitemap

                const path = page.replace('/feed.xml', '')
                const route = path === '/index' ? '' : path

                if (
                  page.search('pages/404.') > -1 ||
                  page.search(`pages/recipes/[...slug].`) > -1
                ) {
                  return
                }
                return `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `
              })
              .join('')}
        </urlset>
    `
  return sitemap
}
