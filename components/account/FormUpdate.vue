<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { ICategory, IUser } from '~/types'
import { useHeaderStore } from '~/stores/header'
export default Vue.extend({
	props: {
		// eslint-disable-next-line vue/require-prop-types
		avatarFile: {
			default: null
		},
		// eslint-disable-next-line vue/require-prop-types
		coverFile: {
			default: null
		},
		buttonText: {
			type: String,
			default: 'Update Profile'
		}
	},
	data() {
		const user = this.$strapi.user as IUser
		return {
			loading: false,
			error: {
				username: {
					message: '',
					valid: false
				}
			},
			form: {
				username: user.username,
				firstName: user.first_name,
				lastName: user.last_name,
				biography: user.biography,
				pronounces: [] as IUser['pronounces'],
				website: user.website
			},
			checkingUsername: false,
			checkingUsernameTimeout: null as number | null
		}
	},
	// emits: ['avatar-uploaded', 'cover-uploaded']
	computed: {
		headerStore: () => useHeaderStore(),
		categories(): ICategory[] {
			return this.headerStore.flattenCategories
		},
		user(): IUser {
			return this.$strapi.user as IUser
		},
		pronounceList(): IUser['pronounces'] {
			return this.user.pronounces.map((item) => {
				let cat: ICategory | undefined
				if (typeof item === 'string') {
					cat = this.categories.find((c) => c.id === item)
				} else {
					cat = this.categories.find((c) => c.id === item.id)
				}
				return {
					id: cat ? cat.id : '',
					title: cat ? cat.title : '',
					slug: cat ? cat.slug : ''
				}
			})
		}
	},
	watch: {
		pronounceList() {
			this.form.pronounces = this.pronounceList
		}
	},
	mounted() {
		if (this.pronounceList.length) {
			this.form.pronounces = this.pronounceList
		}
	},
	methods: {
		async uploadAvatar() {
			if (!this.avatarFile) return
			try {
				const res = await this.$apollo.mutate({
					mutation: gql`
						mutation UploadAvatar(
							$refId: ID!
							$ref: String
							$field: String
							$avatar: Upload!
							$source: String
						) {
							upload(
								ref: $ref
								refId: $refId
								field: $field
								file: $avatar
								source: $source
							) {
								id
								width
								url
								height
								size
								mime
							}
						}
					`,
					variables: {
						refId: this.$strapi.user.id,
						ref: 'user',
						field: 'avatar',
						source: 'users-permissions',
						avatar: this.avatarFile
					}
				})
				// set avatar to strapi user
				await this.$strapi.setUser({
					...this.$strapi.user,
					avatar: res.data.upload
				})

				this.$toast.success('Upload avatar successfully')
				// emit uploaded events
				this.$emit('avatar-uploaded')
			} catch (err) {
				this.$toast.error(
					err instanceof Error ? err.message : 'Upload avatar failed'
				)
			}
		},
		async uploadCover() {
			if (!this.coverFile) return
			try {
				const res = await this.$apollo.mutate({
					mutation: gql`
						mutation uploadCover(
							$refId: ID!
							$ref: String
							$field: String
							$cover: Upload!
							$source: String
						) {
							upload(
								ref: $ref
								refId: $refId
								field: $field
								file: $cover
								source: $source
							) {
								id
								width
								url
								height
								size
								mime
							}
						}
					`,
					variables: {
						refId: this.$strapi.user.id,
						ref: 'user',
						field: 'cover',
						source: 'users-permissions',
						cover: this.coverFile
					}
				})
				// set cover to strapi user
				await this.$strapi.setUser({
					...this.$strapi.user,
					cover: res.data.upload
				})

				this.$toast.success('Upload cover successfully')
				// emit uploaded events
				this.$emit('cover-uploaded')
			} catch (err) {
				this.$toast.error(
					err instanceof Error ? err.message : 'Upload cover failed'
				)
			}
		},
		async submitProfile() {
			this.loading = true
			try {
				await Promise.all([
					this.updateProfile(),
					// if avatar is selected, upload avatar
					this.uploadAvatar(),
					// if cover is selected, upload cover
					this.uploadCover()
				])
			} catch (err) {
				this.$toast.error(
					err instanceof Error ? err.message : 'Update profile failed'
				)
			}
			this.loading = false
		},
		async updateProfile() {
			// update user info
			const res = await this.$apollo.mutate({
				mutation: gql`
					mutation UPDATE_PROFILE(
						$id: ID!
						$username: String
						$first_name: String
						$last_name: String
						$biography: String
						$pronounces: [ID]
						$website: String
					) {
						updateUser(
							input: {
								where: { id: $id }
								data: {
									username: $username
									first_name: $first_name
									last_name: $last_name
									biography: $biography
									website: $website
									pronounces: $pronounces
								}
							}
						) {
							user {
								id
								username
								email
								first_name
								last_name
								biography
								website
								pronounces {
									id
									title
									slug
								}
							}
						}
					}
				`,
				variables: {
					id: this.$strapi.user.id,
					username: this.form.username,
					first_name: this.form.firstName,
					last_name: this.form.lastName,
					biography: this.form.biography,
					website: this.form.website,
					pronounces: this.form.pronounces.map((pronounce) => pronounce.id)
				}
			})
			await this.$strapi.setUser({
				...this.$strapi.user,
				...res.data.updateUser.user
			})
			this.$toast.success('Update profile successfully')
		},
		onEnterUsername() {
			if (this.checkingUsername) return
			if (this.checkingUsernameTimeout)
				window.clearTimeout(this.checkingUsernameTimeout)
			this.checkingUsernameTimeout = window.setTimeout(async () => {
				await this.checkUsername()
			}, 500)
		},
		async checkUsername() {
			this.checkingUsername = true
			try {
				const { data } = await this.$apollo.query<{
					users: Partial<IUser>[]
				}>({
					query: gql`
						query Username($username: String!) {
							users(where: { username: $username }) {
								id
							}
						}
					`,
					variables: { username: this.form.username }
				})
				if (!data.users.length) {
					this.error.username.message = `${this.form.username} is free!`
					this.error.username.valid = true
				} else if (data.users[0].id === this.user.id) {
					this.error.username.message = `You are using ${this.form.username}`
					this.error.username.valid = true
				} else {
					this.error.username.message = `${this.form.username} is not available!`
					this.error.username.valid = false
				}
			} catch (err) {
				if (err instanceof Error) {
					this.$toast.error(err.message)
				}
			}
			this.checkingUsername = false
		}
	}
})
</script>

<template>
	<form class="mt-8" @submit.prevent="submitProfile">
		<div class="grid grid-cols-2 gap-4 mb-8">
			<div>
				<label for="first-name" class="form-label">First Name</label>
				<input
					id="first-name"
					v-model="form.firstName"
					type=" text"
					required
					class="form-control"
					placeholder="Nick"
					autofocus
				/>
			</div>
			<div>
				<label for="last-name" class="form-label">Last Name</label>
				<input
					id="last-name"
					v-model="form.lastName"
					type="text"
					required
					class="form-control"
					placeholder="Snow"
				/>
			</div>
		</div>
		<div class="mb-8">
			<label for="username" class="form-label">Username</label>
			<input
				id="username"
				v-model="form.username"
				type="text"
				required
				class="form-control"
				placeholder="username"
				@keyup="onEnterUsername"
			/>
			<div class="flex justify-between items-center pt-4">
				<p class="text-gray-500 text-sm">
					<span>hotasset.com/profile/</span>
					<strong class="text-red-500 -ml-0.5">{{
						form.username || 'username'
					}}</strong>
				</p>
				<span
					v-if="error.username.message"
					class="text-sm"
					:class="{
						'text-green-500': error.username.valid,
						'text-red-500': !error.username.valid
					}"
					>{{ error.username.message }}</span
				>
			</div>
		</div>
		<div class="mb-8">
			<label for="bio" class="form-label">Bio</label>
			<textarea
				id="bio"
				v-model="form.biography"
				name
				cols="30"
				rows="10"
				class="form-control"
				placeholder="Tell about yourself"
			></textarea>
		</div>
		<div class="mb-8">
			<label for="pronounce" class="form-label">Favorite Categories</label>
			<CoreFormMultiSelect
				:model="form.pronounces"
				:preserve-search="true"
				:options="categories"
				:multiple="true"
				:close-on-select="false"
				:clear-on-select="false"
				placeholder="Select your favorite categories"
				label="title"
				track-by="id"
				@update:model="form.pronounces = $event"
			/>
		</div>
		<div class="mb-8">
			<label for="website" class="form-label">Website</label>
			<input
				id="website"
				v-model="form.website"
				type="text"
				class="form-control"
				placeholder="https://website.com/"
			/>
		</div>
		<div class="mb-8">
			<span class="rounded-md shadow-sm">
				<button
					type="submit"
					class="btn-primary w-full md:w-auto"
					:disabled="loading"
					:class="{ 'opacity-50': loading, 'cursor-not-allowed': loading }"
				>
					{{ buttonText }}
				</button>
			</span>
		</div>
	</form>
</template>
