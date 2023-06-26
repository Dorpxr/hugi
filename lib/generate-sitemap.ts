import fs from 'fs'
import globby from 'globby'
import matter from 'gray-matter'
import prettier from 'prettier'
import siteMetadata from '@/data/siteMetadata'
import { databaseId } from '../lib/notion/client'
import { getDatabase } from './notion/operations'

export const generateSitemap = async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'data/blog/**/*.mdx',
    'data/blog/**/*.md',
    'public/tags/**/*.xml',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/api',
    '!pages/sitemap.xml.tsx',
  ])
  const recipesData = await getDatabase(databaseId)

  recipesData.forEach((recipePage) => {
    const slug = recipePage.properties.Post.title.map(
      (slug) => slug.plain_text.replace(/ /g, '-') + '-' + recipePage.id.replaceAll('-', '')
    )
    const status = recipePage.properties.Status.status.name
    if (status !== 'Draft') {
      pages.push('/recipes/' + slug[0])
    }
  })

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                // Exclude drafts from the sitemap
                if (page.search('.md') >= 1 && fs.existsSync(page)) {
                  const source = fs.readFileSync(page, 'utf8')
                  const fm = matter(source)
                  if (fm.data.draft) {
                    return
                  }
                  if (fm.data.canonicalUrl) {
                    return
                  }
                }
                const path = page
                  .replace('pages/', '/')
                  .replace('data/blog', '/blog')
                  .replace('public/', '/')
                  .replace('.js', '')
                  .replace('.tsx', '')
                  .replace('.mdx', '')
                  .replace('.md', '')
                  .replace('/feed.xml', '')
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

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  // eslint-disable-next-line no-sync
  // fs.writeFileSync('/sitemap.xml', formatted)
  return formatted
}
