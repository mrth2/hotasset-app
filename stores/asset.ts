import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { IAssetFilter, IAsset, IAssetChannel, IAssetProvider, IAssetType, IAssetTypeValue } from '~/@types/asset'
import { IFile } from '~/@types'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    types: [] as IAssetType[],
    channels: [] as IAssetChannel[],
    sortTypes: [
      { name: 'Popular', value: 'title:asc' },
      { name: 'Trending', value: 'likes:desc' },
      { name: 'Latest', value: 'updatedAt:desc' },
    ]
  }),
  getters: {
    getAssetType: (state) => {
      return (resource: IFile) => state.types.find(type => type.mimes.find(mime => mime.mimeType === resource.mime))
    },
    getAssetTypes: (state) => {
      return (files: File[]) => {
        const types = files.map(file => state.types.find(type => type.mimes.find(mime => mime.mimeType === file.type)))
        return types.filter(type => type)
      }
    }
  },
  actions: {
    async fetchAssetMetaData() {
      await this.$nuxt.app.apolloProvider?.defaultClient.query({
        query: gql`
          query ASSET_CHANNEL {
            assetChannels (sort: "order:asc") {
              id
              name
              value
            }
            assetTypes (sort: "order:asc") {
              id
              name
              value
              mimes {
                mimeType
                fileExtension
              }
              icon {
                url
              }
            }
          }
        `
      }).then(({ data }) => {
        this.types = data.assetTypes
        this.channels = data.assetChannels
      })
    },
    async fetchAssets(options: IAssetFilter) {
      const response = await this.$nuxt.app.apolloProvider?.defaultClient.query<{ assets: IAsset[] }>({
        query: gql`
          query ASSETS ($author: ID, $category: String, $type: ID, $channel: ID, $tag: ID, $sort: String, $start: Int, $limit: Int, $download: Boolean) {
            assets (where: { author: { username: $author }, categories: {slug: $category}, types: $type, channels: $channel, tags: $tag, resources: {size_gte: 0}, can_download: $download}, sort: $sort, start: $start, limit: $limit) {
              id
              title
              description
              likes
              author {
                username
                avatar {
                  url
                }
              }
              tags {
                name
              }
              types {
                name
              }
              channels {
                name
              }
              upvoters {
                id
              }
              resources {
                name
                mime
                ext
                size
                url
                width
                height
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: options,
        fetchPolicy: 'network-only'
      })
      if (response) {
        return response.data.assets.map(asset => {
          const type = this.getAssetType(asset.resources[0])
          let provider = IAssetProvider.LOCAL
          let format = 'jpg'
          let url = ''
          if (type?.value === IAssetTypeValue.IMAGE) {
            provider = IAssetProvider.CLOUDINARY
            url = asset.resources[0].url
          }
          else if (type?.value === IAssetTypeValue.PDF) {
            url = '/icons/pdf.svg'
            format = 'svg'
          }
          else if (type?.value === IAssetTypeValue.CSV) {
            url = '/icons/csv.svg'
            format = 'svg'
          }
          else if (type?.value === IAssetTypeValue.PPT) {
            url = '/icons/ppt.svg'
            format = 'svg'
          }

          return {
            ...asset,
            thumbnail: {
              provider,
              url,
              format
            }
          }
        })
      }
      return [] as IAsset[]
    },
    async likeOrUnlikeAsset(assetId: string, upvoter?: string) {
      const response = await this.$nuxt.app.apolloProvider?.defaultClient.mutate<{
        updateAsset: {
          asset: Partial<IAsset>
        }
      }>({
        mutation: gql`
          mutation LIKE_ASSET ($assetId: ID!, $upvoter: [ID]) {
            updateAsset(input: { where: { id: $assetId }, data: { upvoters: $upvoter } }) {
              asset {
                likes
                upvoters {
                  id
                }
              }
            }
          }
        `,
        variables: {
          assetId,
          upvoter: upvoter ? [upvoter] : []
        }
      }).catch((err) => {
        this.$nuxt.app.$toast.error(err.message)
      })
      return response?.data?.updateAsset.asset
    }
  }
})