export interface InsurerAgeGroup {
  start: number
  end: number
  price: string // ex: "4,16"
  price_iof: string // ex: "0.002242"
}

export interface InsurerDestinyData {
  id: number
  name: string
  slug: string
  display_order: number
  destiny_code: string
  crm_bonus_value: number
}

export interface InsurerDestiny {
  destiny: InsurerDestinyData
  age: InsurerAgeGroup[]
}

export interface InsurerCoverageDetail {
  id: number
  title: string
  name: string
  slug: string
  highlight?: string
  content?: string
  display_order?: number
}

export interface InsurerCoverage {
  is: string
  coverage_type: string
  coverage: InsurerCoverageDetail
}

export interface InsurerPlan {
  id: number
  additional_id: number
  ref: string
  slug: string
  is: string
  is_show: string
  name: string
  multitrip: number | boolean
  destinies: InsurerDestiny[]
  coverages?: InsurerCoverage[]
}
