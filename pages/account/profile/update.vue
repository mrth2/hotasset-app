<script lang="ts">
import Vue from 'vue'
import { IUser } from '~/types'

export default Vue.extend({
	name: 'AccountProfileUpdate',
	layout: 'auth',
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
		},
		avatarUrl(): string | null {
			if (this.previewSrc) return this.previewSrc
			return this.user.avatar.url || null
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
		openFinder() {
			if (this.$refs.avatarInput) {
				;(this.$refs.avatarInput as HTMLElement).click()
			}
		},
		selectAvatar({ target: { files = [] } }: any): void {
			if (!files.length) {
				this.previewSrc = ''
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
	<div>
		<div class="mb-8">
			<h2 class="mt-4 text-4xl font-extrabold leading-9 text-gray-900">
				Profile Information
			</h2>
			<p class="mt-4 text-sm leading-5 text-gray-500">
				People visiting your profile will see the following info
			</p>
		</div>
		<div class="user-upload-avatar flex items-center space-x-5">
			<Avatar :src="avatarUrl" :size="72" />
			<input
				ref="avatarInput"
				type="file"
				class="hidden"
				@change="selectAvatar"
			/>
			<button class="btn-primary" @click="openFinder">
				Upload Different Image
			</button>
		</div>
		<AccountFormUpdate :avatar-file="avatarFile" @uploaded="uploaded" />
	</div>
</template>
