import { analyticsDataClient } from '../google/client'
import { PopularRecipes } from './interfaces/popular-recipes.interface'
import { getDatabase, pageToMetaData } from '../notion/operations'
import { PageMetaData } from './interfaces/recipe-metadata.interface'
import siteMetadata from '@/data/siteMetadata'
import { databaseId } from '../notion/client'
import fs from 'fs'

export async function getPopularRecipes(): Promise<PageMetaData[]> {
  try {
    const result = await analyticsDataClient.runReport({
      property: `properties/${siteMetadata.analytics.googleAnalyticsPropertyId}`,
      dateRanges: [
        {
          startDate: '2023-06-18',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    })
    const unrankedRecipes: PopularRecipes[] = []
    const rows = result[0].rows
    for (const row of rows) {
      if (row.dimensionValues[0].value.includes('/recipes/')) {
        const views = row.metricValues[0].value
        const slug = row.dimensionValues[0].value
        const indexOfLastRecipePageSlugDelimeter = slug.lastIndexOf('-')
        const pageId = slug.slice(indexOfLastRecipePageSlugDelimeter + 1)
        unrankedRecipes.push({
          pageId,
          slug,
          views,
        })
      }
    }

    if (process.env.DEBUG === 'true') {
      fs.writeFileSync('mocks/popularRecipes.json', JSON.stringify(unrankedRecipes, null, 2))
    }

    const unrankedRecipesPosts: PageMetaData[] = []
    const orFilter = unrankedRecipes.map((recipe) => ({
      property: 'Post',
      title: {
        contains: recipe.slug.toString().split('/')[2].split('-').slice(0, -1).join(' '),
      },
    }))
    const recipes = await getDatabase(databaseId, {
      or: orFilter,
    })
    for (const recipe of unrankedRecipes) {
      const filterRecipes = recipes.find((page) => page.id.replaceAll('-', '') === recipe.pageId)
      const metaData = await pageToMetaData(recipe.slug, filterRecipes)
      unrankedRecipesPosts.push(metaData)
    }
    return unrankedRecipesPosts
  } catch (err) {
    throw Error(err)
  }
}
