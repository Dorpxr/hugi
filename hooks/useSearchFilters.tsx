import { useState } from 'react'

export interface FilterState {
  filter: string
  isSelected: boolean
}

export const useSearchFilters = (suggestedFilters: string[]) => {
  const [filters, setFilters] = useState<FilterState[]>(
    suggestedFilters.map((filter) => ({
      filter,
      isSelected: false,
    }))
  )

  const updateFilter = (filter: string) => {
    const newState = filters.map((stateFilter) => {
      if (stateFilter.filter === filter) {
        return {
          filter: filter,
          isSelected: !stateFilter.isSelected,
        }
      }
      return stateFilter
    })

    setFilters(newState)
  }

  return {
    filters,
    updateFilter,
  }
}
