import { IFile } from './file'

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

export interface IFooterMenu {
    id: string
    heading: string
    link: Array<{
        id: string
        title: string
        url: string
    }>
}
export declare interface IFooter {
    slogan: string
    logo: IFile
    menu: IFooterMenu[]
}

export * from './user'
export * from './file'
export * from './tag'