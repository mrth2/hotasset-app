import gql from "graphql-tag"
import { defineStore } from "pinia"
import { IUser } from "~/@types/user"

interface UserResponse {
  users: IUser[]
  followers: {
    aggregate: {
      count: number
      totalCount: number
    }
  }
  followings: {
    aggregate: {
      count: number
      totalCount: number
    }
  }
}

export const useUserStore = defineStore('user', {
  actions: {
    async fetchUser(username: string) {
      const data = await this.$nuxt.app.apolloProvider?.defaultClient
        .query<UserResponse>({
          query: gql`
						query User($username: String!) {
							users(where: { username: $username }, limit: 1) {
								id
								username
								avatar {
									provider
									url
								}
								first_name
								last_name
								biography
								website
							}
							followings: userFollowersConnection(
								where: { user: { username: $username } }
							) {
								aggregate {
									count
									totalCount
								}
							}
							followers: userFollowersConnection(
								where: { follower: { username: $username } }
							) {
								aggregate {
									count
									totalCount
								}
							}
						}
					`,
          variables: { username }
        })
      return {
        user: data?.data.users[0],
        followers: data?.data.followers.aggregate.count,
        followings: data?.data.followings.aggregate.count
      }
    }
  }
})