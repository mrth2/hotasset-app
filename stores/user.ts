import gql from "graphql-tag"
import { defineStore } from "pinia"
import { IUser, IUserFollower } from "~/types/user"

interface UserResponse {
	users: IUser[]
	isFollowing?: Array<{
		createdAt: Date
		updatedAt: Date
	}>
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
		async fetchUser(username: string, force = false) {
			// if there is user logged in, check for the following
			const checkFollowing = !!this.$nuxt.app.$strapi.user
			const me = this.$nuxt.app.$strapi.user
			const data = await this.$nuxt.app.apolloProvider?.defaultClient
				.query<UserResponse>({
					query: gql`
						query User($username: String!, $me: ID, $checkFollowing: Boolean!) {
							# user info
							users(where: { username: $username }, limit: 1) {
								id
								username
								cover {
									provider
									url
								}
								avatar {
									provider
									url
								}
								first_name
								last_name
								biography
								website
							}
							# is following ( between this user and current login user )
							isFollowing: userFollowers ( 
								where: { 
									user: { username: $username }, 
									follower: $me 
								}
							) @include(if: $checkFollowing) {
								createdAt
								updatedAt
							}
							# total followings ( who this user follow )
							followings: userFollowersConnection(
								where: { follower: { username: $username } }
							) {
								aggregate {
									count
									totalCount
								}
							}
							# total followed by ( who follow this user )
							followers: userFollowersConnection(
								where: { user: { username: $username } }
							) {
								aggregate {
									count
									totalCount
								}
							}
						}
					`,
					variables: {
						username,
						me: me ? me.id : null,
						checkFollowing
					},
					fetchPolicy: force ? 'no-cache' : undefined
				})
			return {
				user: data?.data.users[0],
				followers: data?.data.followers.aggregate.count,
				followings: data?.data.followings.aggregate.count,
				isFollowing: data?.data.isFollowing?.length && data.data.isFollowing?.[0].createdAt
			}
		},
		async followUser(userId: string) {
			type FollowResponse = {
				createUserFollower: {
					userFollower: IUserFollower
				}
			}
			const data = await this.$nuxt.app.apolloProvider?.defaultClient
				.mutate<FollowResponse>({
					mutation: gql`
						mutation FOLLOW($user: ID!) {
							createUserFollower(input: { data: { user: $user } }) {
								userFollower {
									id
									user {
										first_name
										last_name
										username
									}
									follower {
										first_name
										last_name
										username
									}
								}
							}
						}
					`,
					variables: {
						user: userId
					}
				})
			return data?.data
		},
		async unFollowUser(userId: string) {
			type FollowResponse = {
				deleteUserFollower: {
					userFollower: IUserFollower
				}
			}
			const data = await this.$nuxt.app.apolloProvider?.defaultClient
				.mutate<FollowResponse>({
					mutation: gql`
						mutation UN_FOLLOW($user: ID!) {
							deleteUserFollower(input: { where: { id: $user } }) {
								__typename
							}
						}
					`,
					variables: {
						user: userId
					}
				})
			return data?.data
		}
	}
})