/* eslint-disable camelcase */
export declare interface IFile {
  id: string
  hash: string
  name: string
  mime: string
  ext: string
  size: number
  width: number
  height: number
  url: string
  provider: string
  provider_metadata: {
    public_id: string
    resource_type: string
  }
  createdAt: Date
  updatedAt: Date
}