<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import { IUser } from '~/@types'
import { IAssetFilter } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'

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

export default Vue.extend({
	data() {
		return {
			filters: {
				author: this.$route.params.username,
				type: undefined,
				channel: undefined,
				sort: useAssetStore().sortTypes[0].value,
				limit: 24,
				start: 0
			} as IAssetFilter,
			user: {} as IUser,
			followers: 0,
			followings: 0
		}
	},
	async fetch() {
		await this.$apollo
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
				variables: {
					username: this.$route.params.username
				}
			})
			.then(({ data }) => {
				this.user = data.users[0]
				this.followers = data.followers.aggregate.totalCount
				this.followings = data.followings.aggregate.totalCount
			})
			.catch(() => {
				throw new Error('Failed to fetch user profile')
			})
	},
	computed: {
		isOwner(): boolean {
			return this.$strapi.user.username === this.$route.params.username
		}
	}
})
</script>
<template>
	<main class="border-t relative">
		<div class="profile guest-view">
			<CoreImage
				src="~/assets/images/bgProfile.png"
				alt=""
				class="banner-guest-view absolute inset-0 z-10 w-full justify-center"
			/>
			<div class="flex flex-col z-20">
				<div class="profile__img">
					<CoreImage
						v-if="user.avatar"
						:src="user.avatar.url"
						:modifiers="{ roundCorner: 'max' }"
						class="rounded-full mx-auto"
					/>
					<FontAwesomeIcon v-else :icon="['far', 'user-circle']" size="6x" />
				</div>

				<div class="profile-social">
					<a href="#">
						<CoreImage src="~/assets/images/icons/twitter.svg" alt="" />
					</a>
					<a href="#">
						<CoreImage src="~/assets/images/icons/facebook.svg" alt="" />
					</a>
					<a href="#">
						<CoreImage src="~/assets/images/icons/instagram.svg" alt="" />
					</a>
				</div>
				<h2 class="profile__name">
					{{ user.first_name }} {{ user.last_name }}
				</h2>
				<p class="profile__desc">
					{{ user.biography }}
				</p>
				<div class="profile-follow">
					<div class="follow-count profile-follower">
						<em>{{ followers }}</em>
						<span>&nbsp;followers </span>
					</div>
					<div class="follow-count">
						<em>{{ followings }}</em>
						<span>&nbsp;followings </span>
					</div>
				</div>
				<div v-if="isOwner" class="flex space-x-4 justify-center">
					<button class="btn-secondary w-full md:w-auto mb-4">Follow</button>
					<button class="btn-secondary w-full md:w-auto mb-4">Likes</button>
				</div>
				<div v-else>
					<button class="btn btn-primary w-full md:w-auto mb-4">Follow</button>
				</div>
			</div>
		</div>
		<!--End .profile-->
		<div class="container mx-auto px-4 sm:px-6 mb-10">
			<AssetListing
				:filters="filters"
				:no-photo-message="`${
					user.first_name || user.username
				} does not upload any assets yet!`"
				@update:filters="filters = $event"
			/>
		</div>
	</main>
</template>

<style scoped lang="postcss">
.profile {
	@apply grid justify-center text-center flex-row space-y-3;
	margin-top: 10%;
}
.profile-wrapper {
	@apply flex flex-col z-20 space-y-3 md:space-y-3;
}
.profile-social {
	@apply flex space-x-4 justify-center mb-3;
}
.banner-guest-view {
	min-height: 100px;
	max-height: 200px;
}
/* .profile.guest-view {
	background: url("./images/bgProfile.png") no-repeat top left;
	background-size: cover;
} */
.profile__img {
	@apply w-24 md:w-48 mx-auto mb-6;
}
.profile__name {
	@apply text-2xl md:text-4xl font-bold mb-1;
}
.profile__desc {
	@apply text-gray-500 mb-3;
}
.profile-follow {
	@apply flex justify-center items-center mb-6 space-x-3;
}
.profile-follower:after {
	content: '•';
	@apply inline-block text-gray-500 text-2xl relative top-0.5 ml-3;
}
.follow-count {
	@apply flex items-center cursor-default;

	em {
		@apply font-bold not-italic;
	}
	span {
		@apply text-gray-500;
	}

	&:hover {
		em,
		span {
			@apply text-brand underline;
		}
	}
}
</style>
