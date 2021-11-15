/* eslint-disable camelcase */
export declare interface ICategory {
    id: number
    title: string
    slug: string
    is_new: boolean
    sub_categories: ICategory[]
}

export * from './user'