<script lang="ts">
import Vue from 'vue'
import { IUser } from '~/types'
import { IAssetFilter } from '~/types/asset'
import { useAssetStore } from '~/stores/asset'
import { useUserStore } from '~/stores/user'

export default Vue.extend({
	async asyncData({ route, error }) {
		try {
			const data = await useUserStore().fetchUser(route.params.username)
			if (!data.user) {
				throw new Error('User not found')
			}
			return data
		} catch (_err) {
			error({
				statusCode: 404,
				message: 'User not found'
			})
		}
	},
	data() {
		return {
			filters: {
				author: this.$route.params.username,
				type: undefined,
				channel: undefined,
				sort: useAssetStore().sortTypes[0].value,
				limit: 24,
				start: 0
			} as Partial<IAssetFilter>,
			activeTab: 'uploads' as 'uploads' | 'likes',
			user: {} as IUser,
			followers: 0,
			followings: 0,
			isFollowing: false,
			requestingFollow: false
		}
	},
	computed: {
		isOwner(): boolean {
			return this.$strapi.user?.username === this.$route.params.username
		}
	},
	methods: {
		async fetchUser() {
			const data = await useUserStore().fetchUser(this.$route.params.username, true)
			if (data.user && data.followers && data.followings && data.isFollowing) {
				this.user = data.user
				this.followers = data.followers
				this.followings = data.followings
			}
		},
		async follow() {
			if (this.requestingFollow || this.isFollowing) {
				return
			}
			if (!this.$strapi.user) {
				this.$router.push('/login')
				return
			}
			this.requestingFollow = true
			this.isFollowing = true
			this.followers++
			await useUserStore()
				.followUser(this.user.id)
				.then((data) => {
					if (data) {
						this.$toast.success(
							`You're now following ${this.$displayName(
								data.createUserFollower.userFollower.user
							)}.`
						)
					}
					// refetch user to update followers count
					this.fetchUser()
				})
				.catch((err) => {
					this.isFollowing = false
					this.$toast.error(err.message)
				})
				.finally(() => {
					this.requestingFollow = false
				})
		},
		async unFollow() {
			if (this.requestingFollow || !this.isFollowing) {
				return
			}
			if (!this.$strapi.user) {
				this.$router.push('/login')
				return
			}
			this.requestingFollow = true
			this.isFollowing = false
			this.followers--
			await useUserStore()
				.unFollowUser(this.user.id)
				.then((data) => {
					if (data) {
						this.$toast.success(
							`You have unfollowed ${this.$displayName(this.user)}.`
						)
					}
					// refetch user to update followers count
					this.fetchUser()
				})
				.catch((err) => {
					this.$toast.error(err.message)
					this.isFollowing = true
				})
				.finally(() => {
					this.requestingFollow = false
				})
		},
		showUploads() {
			this.activeTab = 'uploads'
			this.filters = {
				...this.filters,
				author: this.$route.params.username,
				upvoter: undefined
			}
		},
		showLikes() {
			this.activeTab = 'likes'
			this.filters = {
				...this.filters,
				upvoter: this.user.id,
				author: undefined
			}
		}
	}
})
</script>
<template>
	<main v-if="user" class="border-t relative">
		<div class="profile guest-view">
			<CoreImage
				:src="user.cover ? user.cover.url : '~/assets/images/bgProfile.png'"
				alt=""
				class="
					banner-guest-view
					absolute
					inset-0
					z-10
					w-full
					justify-center
					object-cover object-center
				"
			/>
			<div class="flex flex-col z-20">
				<div class="profile__img">
					<Avatar
						:src="user.avatar ? user.avatar.url : null"
						:size="96"
						class="mx-auto"
					/>
				</div>

				<!-- <div class="profile-social">
					<a href="#">
						<CoreImage src="~/assets/images/icons/twitter.svg" alt="" />
					</a>
					<a href="#">
						<CoreImage src="~/assets/images/icons/facebook.svg" alt="" />
					</a>
					<a href="#">
						<CoreImage src="~/assets/images/icons/instagram.svg" alt="" />
					</a>
				</div> -->
				<h2 class="profile__name">
					{{ $displayName(user) }}
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
						<span>&nbsp;following </span>
					</div>
				</div>
				<!-- owner action: upload and check likes -->
				<div v-if="isOwner" class="flex space-x-4 justify-center">
					<button
						class="btn-secondary w-full md:w-auto mb-4"
						:class="{ 'border-2 border-brand': activeTab === 'uploads' }"
						@click="showUploads"
					>
						Uploads
					</button>
					<button
						class="btn-secondary w-full md:w-auto mb-4"
						:class="{ 'border-2 border-brand': activeTab === 'likes' }"
						@click="showLikes"
					>
						Likes
					</button>
				</div>
				<!-- guest action: un/follow -->
				<div v-else>
					<button
						class="btn btn-follow"
						:class="{
							'btn-primary': isFollowing,
							'btn-secondary': !isFollowing
						}"
						@click="isFollowing ? unFollow() : follow()"
					>
						{{ isFollowing ? 'Unfollow' : 'Follow' }}
					</button>
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
	max-height: 130px;

	@screen md {
		max-height: 150px;
	}

	@screen xl {
		max-height: 200px;
	}

	@screen 2xl {
		max-height: 250px;
	}
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
.btn-follow {
	@apply w-full md:w-auto mb-4;
}
</style>
