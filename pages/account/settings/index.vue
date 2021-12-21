<script lang="ts">
import Vue from 'vue'
import { IUser } from '~/types'
export default Vue.extend({
	middleware: 'require-login',
	data() {
		return {
			avatarFile: null as File | null,
			coverFile: null as File | null,
			previewAvatar: null as string | null,
			previewCover: null as string | null
		}
	},
	computed: {
		user(): IUser {
			return this.$strapi.user as IUser
		}
	},
	watch: {
		avatarFile() {
			if (this.avatarFile) {
				const reader = new FileReader()
				reader.addEventListener('load', () => {
					this.previewAvatar = reader.result as string
				})
				reader.readAsDataURL(this.avatarFile)
			} else {
				this.previewAvatar = null
			}
		},
		coverFile() {
			if (this.coverFile) {
				const reader = new FileReader()
				reader.addEventListener('load', () => {
					this.previewCover = reader.result as string
				})
				reader.readAsDataURL(this.coverFile)
			} else {
				this.previewCover = null
			}
		}
	},
	methods: {
		avatarUrl() {
			let url: string | null = null
			if (this.previewAvatar) url = this.previewAvatar
			else if (this.user.avatar) url = this.user.avatar.url
			return {
				backgroundImage: url ? `url(${url})` : 'none'
			}
		},
		coverUrl() {
			let url: string | null = this.$img('bgPublicProfile.png')
			if (this.previewCover) url = this.previewCover
			else if (this.user.cover) url = this.user.cover.url
			return {
				backgroundImage: `url(${url})`
			}
		},
		openFinder(type: 'avatar' | 'cover') {
			if (type === 'avatar') {
				const avatarInput = this.$refs.avatarInput as HTMLElement
				if (avatarInput) avatarInput.click()
			} else {
				const coverInput = this.$refs.coverInput as HTMLElement
				if (coverInput) coverInput.click()
			}
		},
		selectAvatar({ target: { files = [] } }: any): void {
			if (!files.length) {
				this.avatarFile = null
				return
			}
			this.avatarFile = files[0]
		},
		selectCover({ target: { files = [] } }: any): void {
			if (!files.length) {
				this.coverFile = null
				return
			}
			this.coverFile = files[0]
		},
		avatarUploaded() {
			if (
				this.$refs.avatarInput &&
				this.$refs.avatarInput instanceof HTMLInputElement
			)
				this.$refs.avatarInput.value = ''
		},
		coverUploaded() {
			if (
				this.$refs.coverInput &&
				this.$refs.coverInput instanceof HTMLInputElement
			)
				this.$refs.coverInput.value = ''
		}
	}
})
</script>
<template>
	<main class="border-t relative">
		<div class="max-w-screen-xl mx-auto px-5">
			<div class="content py-10 flex justify-between">
				<aside class="hidden lg:block pt-2">
					<ul class="side-nav py-3 shadow-xl border border-gray-50">
						<li>
							<a href="#" class="side-nav__link active"
								><img src="~/assets/images/icons/Setting.svg" alt="" /> Public
								Profile</a
							>
						</li>
						<li>
							<a href="#" class="side-nav__link"
								><img src="~/assets/images/icons/Filter.svg" alt="" /> Account
								Settings</a
							>
						</li>
						<li>
							<a href="#" class="side-nav__link"
								><img src="~/assets/images/icons/Discovery.svg" alt="" /> Home
								Feed Tuner</a
							>
						</li>
						<li>
							<a href="#" class="side-nav__link"
								><img src="~/assets/images/icons/Shield-Done.svg" alt="" />
								Claim</a
							>
						</li>
						<li>
							<a href="#" class="side-nav__link"
								><img src="~/assets/images/icons/Notification.svg" alt="" />
								Notifications</a
							>
						</li>
						<li>
							<a href="#" class="side-nav__link"
								><img src="~/assets/images/icons/Password.svg" alt="" /> Privacy
								& Data</a
							>
						</li>
					</ul>
				</aside>

				<div class="w-full sm:max-w-xl mx-auto self-center">
					<div class="mb-8">
						<h2
							class="
								text-2xl
								mt-4
								md:text-4xl
								font-extrabold
								leading-9
								text-gray-900 text-center
								md:text-left
							"
						>
							Public Profile
						</h2>
						<p class="mt-4 leading-5 text-gray-500">
							People visiting your profile will see the following info
						</p>
					</div>
					<input
						ref="avatarInput"
						type="file"
						class="hidden"
						@change="selectAvatar"
					/>
					<input
						ref="coverInput"
						type="file"
						class="hidden"
						@change="selectCover"
					/>
					<div class="public-profile-banner relative">
						<div class="absolute inset-0 bg-center bg-cover bg-no-repeat" :style="coverUrl()" @click="openFinder('cover')"></div>
						<div
							class="public-profile-banner-upload"
							:style="avatarUrl()"
							@click.prevent="openFinder('avatar')"
						>
							<span><img src="~/assets/images/icons/upload.svg" alt="" /></span>
						</div>
					</div>
					<AccountFormUpdate
						btn-text="Save Changes"
						:avatar-file="avatarFile"
						:cover-file="coverFile"
						@avatar-uploaded="avatarUploaded"
						@cover-uploaded="coverUploaded"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
