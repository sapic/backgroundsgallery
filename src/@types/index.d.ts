import { Knex } from 'knex'
import Cacher from '@/lib/votesCacher'

interface AppUser {
  id: string
  displayName: string
  username: string
  profileUrl: string
  photos: string
}

declare global {
  type KnexType = Knex<any, unknown[]> // eslint-disable-line

  interface Window {
    gtag?: any
  }
}

declare module 'next' {
  interface NextApiRequest {
    db: KnexType
    Cacher: Cacher
    user?: AppUser
  }
}

// declare module '@types/express' {
//   export interface User {
//     id: string
//   }
// }

// declare module '@types/express-serve-static-core' {
//   export interface User {
//     id: string
//   }
// }
