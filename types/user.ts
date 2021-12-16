import { IAsset } from "./asset";
import { IFile } from "./file";

/* eslint-disable camelcase */
export declare interface IUserRole {
  id: string
  name: string
  description: string
  type: string
}

export declare interface IUser {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  confirmed: boolean
  blocked: boolean
  provider: string
  avatar: IFile
  biography: string
  website: string
  pronounces: Array<{ id: string, title: string, slug: string }>
  role: IUserRole
  createdAt: Date
  updatedAt: Date
  upvoted_assets: IAsset[]
}

export interface IUserFollower {
  id: string
  user: IUser
  follower: IUser
  createdAt: Date
  updatedAt: Date
}