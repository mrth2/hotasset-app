<script lang="ts">
import Vue from 'vue'
import { IUser } from '~/types'
export default Vue.extend({
	middleware: 'require-login',
	data() {
		return {
			avatarFile: null as File | null,
			previewSrc: null as string | null
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
					this.previewSrc = reader.result as string
				})
				reader.readAsDataURL(this.avatarFile)
			} else {
				this.previewSrc = null
			}
		}
	},
	methods: {
		avatarUrl() {
			let url: string | null = null
			if (this.previewSrc) url = this.previewSrc
			else if (this.user.avatar) url = this.user.avatar.url
			return {
				backgroundImage: url ? `url(${url})` : 'none'
			}
		},
		openFinder() {
			if (this.$refs.avatarInput) {
				;(this.$refs.avatarInput as HTMLElement).click()
			}
		},
		selectAvatar({ target: { files = [] } }: any): void {
			if (!files.length) {
				this.avatarFile = null
				return
			}
			this.avatarFile = files[0]
		},
		uploaded() {
			if (
				this.$refs.avatarInput &&
				this.$refs.avatarInput instanceof HTMLInputElement
			)
				this.$refs.avatarInput.value = ''
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
					<div
						class="public-profile-banner"
						:style="`background-image: url(${$img('bgPublicProfile.png')})`"
						@click="openFinder"
					>
						<div class="public-profile-banner-upload" :style="avatarUrl()">
							<span><img src="~/assets/images/icons/upload.svg" alt="" /></span>
						</div>
					</div>
					<AccountFormUpdate
						btn-text="Save Changes"
						:avatar-file="avatarFile"
						@uploaded="uploaded"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
