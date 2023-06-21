import { analyticsDataClient } from '../google/client'
import { PopularRecipes } from './interfaces/popular-recipes.interface'
import { getPage, pageToMetaData } from '../notion/getOps'
import { PageMetaData } from '../notion/interfaces/recipePageMetaData.interface'
import siteMetadata from '@/data/siteMetadata'

export const getPopularRecipes: () => Promise<PageMetaData[]> = async () => {
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
    result[0].rows.forEach((row) => {
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
    })
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
