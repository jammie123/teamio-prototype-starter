import type { StyleProps } from '../../lib/types'

export type JobsFilterOption = { value: string; label: string; description?: string }

export type JobsFilterEmploymentType = 'fullTime' | 'partTime'
export type JobsFilterAdvertisementStatus = 'active' | 'ended'

export interface JobsFilterValue {
  query: string
  recruiterId: string
  managerId: string
  departmentId: string
  employmentType: JobsFilterEmploymentType | ''
  advertisementStatus: JobsFilterAdvertisementStatus | ''
}

export interface JobsFilterProps extends StyleProps {
  value: JobsFilterValue
  onChange: (next: JobsFilterValue) => void
  recruiters: JobsFilterOption[]
  managers: JobsFilterOption[]
  departments: JobsFilterOption[]
  sortValue?: string
  sortOptions?: JobsFilterOption[]
  onSortChange?: (next: string) => void
  moreFiltersOpen?: boolean
  defaultMoreFiltersOpen?: boolean
  onMoreFiltersOpenChange?: (open: boolean) => void
}
