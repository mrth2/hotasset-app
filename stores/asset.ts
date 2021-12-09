import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { IAssetFilter, IAsset, IAssetChannel, IAssetType } from '~/@types/asset'
import { IFile, IUserFollower } from '~/@types'

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
    },
    getAssetSchema() {
      return `
        id
        title
        description
        likes
        author {
          id
          username
          avatar {
            url
          }
        }
        categories {
          id
          title
          slug
          is_new
        }
        tags {
          id
          name
          slug
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
          id
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
      `
    }
  },
  actions: {
    isIcon(url: string) {
      return (
        url.includes('ppt.svg') ||
        url.includes('pdf.svg') ||
        url.includes('csv.svg')
      )
    },
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
    async fetchAssets(options: Partial<IAssetFilter>, count = false) {
      const where = `
        { 
          # on profile page
          author: { username: $author },
          # on categry page
          categories: {slug: $category},
          # on dropdown filters
          types: $type, 
          channels: $channel,
          tags: $tag, 
          can_download: $download,
          # for detail page, query assets that different from current asset
          id_ne: $not_id,
          # as always to exclude broken asset posts with no valid file
          resources: { size_gte: 0 },
          # use or in specific case
          _or: [
            # query similar
            { tags_in: [$tags] },
            { categories_in: [$categories] },
            # query search
            { title_contains: $search },
            { description_contains: $search }
            { tags: { name_contains: $search } },
            { categories: { title_contains: $search } }
          ]
        }
      `
      const response = await this.$nuxt.app.apolloProvider?.defaultClient.query<{ assets: IAsset[], count?: { aggregate: { count: number } } }>({
        query: gql`
          query ASSETS (
            $author: ID, $not_id: ID, 
            $type: ID, $channel: ID, 
            $category: String, $categories: [ID],
            $tag: ID, $tags: [ID],
            $search: String,
            $sort: String, $start: Int, $limit: Int, $download: Boolean
            $count: Boolean!
          ) {
            assets (
              where: ${where},
              sort: $sort, 
              start: $start, 
              limit: $limit
            ) {
              ${this.getAssetSchema}
            }
            # get count
            count: assetsConnection (where: ${where}) @include(if: $count) {
              aggregate {
                count
              }
            }
          }
        `,
        variables: { ...options, count },
        fetchPolicy: 'network-only'
      })
      if (response) {
        return {
          assets: response.data.assets.map(asset => {
            const type = this.getAssetType(asset.resources[0])
            const { provider, url, format } = this.$nuxt.app.$getAssetUrl(asset.resources[0].url, type?.value)
            return {
              ...asset,
              thumbnail: {
                provider,
                url,
                format
              }
            }
          }),
          count: response.data?.count?.aggregate.count || 0
        }
      }
      return {
        assets: [] as IAsset[],
        count: 0
      }
    },
    async fetchAssetDetail(assetId: string, meId: string, checkFollowing = true) {
      return await this.$nuxt.app.apolloProvider?.defaultClient
        .query<{ asset: IAsset; isFollowing?: Partial<IUserFollower> }>({
          query: gql`
					query AssetDetail($id: ID!, $me: ID, $checkFollowing: Boolean!) {
						asset(id: $id) {
							${useAssetStore().getAssetSchema}
						}
						isFollowing: userFollowers ( 
							where: { 
								user: $id, 
								follower: $me 
							}
						) @include(if: $checkFollowing) {
							createdAt
							updatedAt
						}
					}
				`,
          variables: {
            id: assetId,
            me: meId,
            checkFollowing
          },
          fetchPolicy: 'no-cache'
        })
        .then(({ data }) => {
          const asset = data.asset
          let isFollowing = false
          if (asset.resources.length > 0) {
            asset.resources = asset.resources.map((resource) => {
              const type = useAssetStore().getAssetType(resource)
              if (!type) return resource
              const { url, format } = this.$nuxt.app.$getAssetUrl(resource.url, type?.value)
              return {
                ...resource,
                url,
                format,
                type: type.value
              }
            })
          }
          if (data.isFollowing) {
            isFollowing = !!data.isFollowing.createdAt
          }
          return { asset, isFollowing }
        })
        .catch((err) => {
          throw err
        })
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
      })
      return response?.data?.updateAsset.asset
    }
  }
})