export interface AnimatedBg {
  appid: string
  defid: string
  type: number
  communityItemClass: number
  communityItemType: number
  pointCost: number
  timestampCreated: string
  timestampUpdated: string
  timestampAvailable: string
  quantity: number
  internalDescription: string
  active: boolean
  communityItemData: CommunityItemData
  timestampAvailableEnd: string
  usableDuration: string
  bundleDiscount: string
  views: string
  votes: string
  popularity: number
  goodness: number
  game: string
}

export interface CommunityItemData {
  animated: boolean
  itemName: string
  itemTitle: string
  itemMovieMp4: string
  itemMovieWebm: string
  itemImageLarge: string
  itemDescription: string
  itemMovieMp4Small: string
  itemMovieWebmSmall: string
}
