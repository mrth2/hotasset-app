/* eslint-disable camelcase */
export declare interface ICategory {
    id: string
    title: string
    slug: string
    is_new: boolean
    sub_categories?: ICategory[]
}

export * from './user'
export * from './file'
export * from './tag'