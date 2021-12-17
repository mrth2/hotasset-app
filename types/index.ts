/* eslint-disable camelcase */
export declare interface ICategory {
    id: string
    title: string
    slug: string
    is_new: boolean
    sub_categories?: ICategory[]
}

export declare interface ISocialLinks {
    twitter: string
    instagram: string
    facebook: string
    linkedin: string
    dribble: string
}

export * from './user'
export * from './file'
export * from './tag'