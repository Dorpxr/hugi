import { useState } from 'react'
import { FilterState } from './useSearchFilters'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'

type Props = {
  filters: FilterState[]
  posts: PageMetaData[]
}

export const useSearch = ({ filters, posts }: Props) => {
  const [searchValue, setSearchValue] = useState('')
  const hasEnabledFilters = filters.filter((filter) => filter.isSelected)
  const filteredBlogPosts = posts.filter((post) => {
    const contentToSearch = {
      text: post.title + post.summary + post.tags.join(' '),
      filters: post.tags.join(' '),
    }
    const enabledFilters = filters.filter(({ isSelected }) => isSelected)
    const filterSearchQuery = enabledFilters.map(({ filter }) =>
      filter.replace('-', ' ').toLowerCase()
    )
    const searchQuery = searchValue
    const textMatches = contentToSearch.text
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
    const filterMatches = post.tags.filter((tag) => filterSearchQuery.includes(tag))
    const hasTextMatch = textMatches && searchValue !== ''
    const hasFilterMatch =
      filterMatches.length === enabledFilters.length && enabledFilters.length > 0
    if (hasFilterMatch && hasTextMatch) {
      return true
    }

    if (hasFilterMatch && !searchValue) {
      return true
    }

    if (hasTextMatch && hasEnabledFilters.length === 0) {
      return true
    }

    return false
  })

  return {
    searchValue,
    setSearchValue,
    filteredBlogPosts,
    hasEnabledFilters,
  }
}
