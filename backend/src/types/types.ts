export interface HeroAgeGroup {
  start: number
  end: number
  price: string // vem como string "4,16"
  price_iof: string // idem
}

export interface HeroDestinyData {
  id: number
  name: string
  slug: string
  display_order: number
  destiny_code: string
  crm_bonus_value: number
}

export interface HeroDestiny {
  destiny: HeroDestinyData
  age: HeroAgeGroup[]
}

export interface HeroPlan {
  id: number
  additional_id: number
  ref: string
  slug: string
  is: string
  is_show: string
  name: string
  multitrip: number | boolean
  destinies: HeroDestiny[]
}
