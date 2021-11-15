/* eslint-disable camelcase */
export declare interface IUserRole {
  id: string
  name: string
  description: string
  type: string
}

export declare interface IUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  confirmed: boolean
  blocked: boolean
  provider: string
  avatar: string
  biography: string
  website: string
  role: IUserRole
  createdAt: Date
  updatedAt: Date
}