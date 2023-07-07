import { analyticsDataClient } from '../google/client'
import { PopularStories } from './interfaces/popular-stories.interface'
import { getDatabase, pageToMetaData } from '../notion/operations'
import { PageMetaData } from './interfaces/page-metadata.interface'
import siteMetadata from '@/data/siteMetadata'
import { databaseId } from '../notion/client'
import fs from 'fs'

export async function getPopularStories(): Promise<PageMetaData[]> {
  try {
    const result = await analyticsDataClient.runReport({
      property: `properties/${siteMetadata.analytics.googleAnalyticsPropertyId}`,
      dateRanges: [
        {
          startDate: `${siteMetadata.featureFlags.popularStoriesCarousel.dateRange}daysAgo`,
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
    const unrankedStories: PopularStories[] = []
    const rows = result[0].rows
    if (process.env.DEBUG === 'true') {
      fs.writeFileSync('mocks/unrankedStories.json', JSON.stringify(unrankedStories, null, 2))
    }
    for (const row of rows) {
      const rowDimensionValue = row.dimensionValues[0].value
      if (rowDimensionValue.includes('/stories/') && !rowDimensionValue.includes('/page/2')) {
        const views = row.metricValues[0].value
        const slug = row.dimensionValues[0].value
        const indexOfLastStoryPageSlugDelimeter = slug.lastIndexOf('-')
        const pageId = slug.slice(indexOfLastStoryPageSlugDelimeter + 1)
        unrankedStories.push({
          pageId,
          slug,
          views,
        })
      }
    }

    if (process.env.DEBUG === 'true') {
      fs.writeFileSync('mocks/popularStories.json', JSON.stringify(unrankedStories, null, 2))
    }

    const unrankedStoriesPosts: PageMetaData[] = []
    const orFilter = unrankedStories.map((recipe) => ({
      property: 'Story',
      title: {
        contains: recipe.slug.toString().split('/')[2].split('-').slice(0, -1).join(' '),
      },
    }))
    const recipes = await getDatabase(databaseId, {
      filter: { or: orFilter },
    })
    for (const recipe of unrankedStories) {
      const filterRecipes = recipes.find((page) => page.id.replaceAll('-', '') === recipe.pageId)
      if (filterRecipes) {
        const metaData = await pageToMetaData(filterRecipes)
        unrankedStoriesPosts.push(metaData)
      }
    }
    return unrankedStoriesPosts
  } catch (err) {
    throw Error(err)
  }
}
