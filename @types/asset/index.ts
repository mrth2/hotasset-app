/* eslint-disable camelcase */
import { ICategory } from "../index";
import { IFile } from "../file";
import { ITag } from "../tag";
import { IUser } from "../user";

interface IAssetMime {
  application: string
  mimeType: string
  fileExtension: string
}
export interface IAssetType {
  id: string
  name: string
  value: string
  order: number
  mimes: IAssetMime[]
  icon: IFile
}

export interface IAssetChannel {
  id: string
  name: string
  value: string
  order: number
}

export enum IAssetProvider {
  LOCAL = "ipx",
  CLOUDINARY = 'cloudinary'
}

export enum IAssetTypeValue {
  IMAGE = "image",
  PDF = 'pdf',
  CSV = 'csv',
  VIDEO = 'video',
  PPT = 'ppt'
}

export interface IAsset {
  id: string
  title: string
  description: string
  resources: IFile[]
  types: IAssetType[]
  channels: IAssetChannel[]
  can_download: boolean
  category: ICategory
  tags: ITag[]
  likes: number
  upvoters: IUser[]
  createdAt: Date
  updatedAt: Date
  author: IUser
  // custom
  thumbnail: {
    provider: IAssetProvider
    url: string
    format: string
  }
}

export interface IAssetFilter {
  channel?: string,
  type?: string,
  tag?: string,
  sort?: string,
  start?: number,
  limit?: number
}