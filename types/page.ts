/* eslint-disable camelcase */
export interface IPage {
  id: string
  slug: string
  page: {
    title: string
    description: string
    cover: {
      url: string
    }
    SEO: {
      meta_title: string
      meta_description: string
    }
    content: string
  }
}