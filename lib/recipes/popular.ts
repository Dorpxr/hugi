import { analyticsDataClient } from '../google/client'
import { PopularRecipes } from './interfaces/popular-recipes.interface'
import { getPage } from '../notion/getOps'
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
      const pageResponse = await getPage(recipe.pageId)
      const title = recipe.slug.toString().split('/')[2].split('-').slice(0, -1).join(' ')
      const tags = pageResponse.properties.Tags.multi_select.map((tag) => tag.name)
      const createdAt = pageResponse.created_time.split('T')[0].toString()
      const status = pageResponse.properties.Status.status.name
      const cookTime = pageResponse.properties.CookTime.number
      const summary = pageResponse.properties.Summary.rich_text[0].text.content
      const featureImage = pageResponse.properties.FeatureImage.files[0].file.url
      const lastModifiedAt = pageResponse.last_edited_time.split('T')[0].toString()
      unrankedRecipesPosts.push({
        slug: recipe.slug,
        title,
        tags,
        createdAt,
        status,
        cookTime,
        summary,
        featureImage,
        lastModifiedAt,
      })
    }
    return unrankedRecipesPosts
  } catch (err) {
    throw Error('Could not retrieve popular recipes')
  }
}
