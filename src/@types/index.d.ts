import { Knex } from 'knex'

declare global {
  type KnexType = Knex<any, unknown[]> // eslint-disable-line

  namespace Express {
    interface User {
      id: string
      displayName: string
      username: string
      profileUrl: string
      photos: string
    }
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
