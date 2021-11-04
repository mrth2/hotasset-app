/* eslint-disable camelcase */
export declare interface ICategory {
    id: number
    title: string
    slug: string
    is_new: boolean
    sub_categories: ICategory[]
}

export declare interface IUser {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
}