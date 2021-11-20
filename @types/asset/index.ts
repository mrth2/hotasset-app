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
  name: string
  value: string
  order: number
  mimes: IAssetMime[]
}

export interface IAssetChannel extends IAssetType { }

export interface IAsset {
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
}