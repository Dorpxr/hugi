import { analyticsDataClient } from '../google/client'
import { PopularRecipes } from './interfaces/popular-recipes.interface'
import { getPage, pageToMetaData } from '../notion/operations'
import { PageMetaData } from './interfaces/recipe-metadata.interface'
import siteMetadata from '@/data/siteMetadata'

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

    const unrankedRecipesPosts: PageMetaData[] = []
    for (const recipe of unrankedRecipes) {
      const page = await getPage(recipe.pageId)
      const metaData = await pageToMetaData(recipe.slug, page)
      unrankedRecipesPosts.push(metaData)
    }
    return unrankedRecipesPosts
  } catch (err) {
    throw Error('Could not retrieve popular recipes')
  }
}
