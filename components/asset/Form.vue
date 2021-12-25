<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'
import { mapActions } from 'pinia'
import { ICategory, ITag } from '~/types'
import { useHeaderStore } from '~/stores/header'
import { useAssetStore } from '~/stores/asset'
import { IAsset } from '~/types/asset'

interface AssetPreview {
	name: string
	url: string
}

function initData(asset: IAsset | null) {
	const initialForm = {
		title: asset?.title || '',
		description: asset?.description || '',
		category: asset?.categories?.[0] || ({} as ICategory),
		tags: asset?.tags || ([] as ITag[]),
		files: [] as File[]
	}
	let assetPreviews: AssetPreview[] = []
	if (asset) {
		assetPreviews = asset.resources.map((image) => {
			let url = image.url
			if (image.ext === 'csv') {
				url = '~/assets/images/icons/csv.svg'
			} else if (image.ext === 'ppt') {
				url = '~/assets/images/icons/ppt.svg'
			} else if (image.ext === 'pdf') {
				url = '~/assets/images/icons/pdf.svg'
			}
			return {
				name: image.name,
				url
			}
		})
	}
	let assetResourceIds: string[] = []
	if (asset) {
		assetResourceIds = asset.resources.map((image) => image.id)
	}
	return {
		initialForm,
		form: cloneDeep(initialForm),
		assetPreviews,
		assetResourceIds
	}
}

export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<IAsset | null>,
			default() {
				return null
			}
		}
	},
	data() {
		return {
			...initData(this.asset),
			filePreviews: [] as AssetPreview[],
			currentPreviewIndex: 0,
			listTags: [] as ITag[],
			isLoading: false,
			isSubmitting: false,
			MAX_FILES_ALLOWED: 6,
			MAX_TAGS_ALLOWED: 10,
			// hide tag dropdown when there are no tags
			hideTagSelection: true
		}
	},
	async fetch() {
		// await this.findTags('', 10)
		await useAssetStore().fetchAssetMetaData()
	},
	computed: {
		listCategories(): ICategory[] {
			return useHeaderStore().flattenCategories
		},
		isEditMode(): boolean {
			return !!this.asset?.id
		},
		isOwner(): boolean {
			return (
				this.$strapi.user && this.$strapi.user.id === this.asset?.author?.id
			)
		},
		imagePreviews: {
			get(): Array<{ name: string; url: string }> {
				return [...this.assetPreviews, ...this.filePreviews]
			}
		}
	},
	methods: {
		...mapActions(useAssetStore, ['isIcon']),
		addTag(name: string) {
			if (
				!this.form.tags.find((tag) => tag.name === name) &&
				this.form.tags.length < this.MAX_TAGS_ALLOWED
			) {
				this.form.tags.push({
					id: name,
					name,
					slug: name
				})
			}
			this.hideTagSelection = true
			return true
		},
		onSearchTag(query: string) {
			this.hideTagSelection = true
			// if query has commas, we add tag
			if (query.includes(',')) {
				query
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag)
					.forEach((tag) => this.addTag(tag))
				// clear multiselect search input
				if (this.$refs.tags instanceof Vue) {
					const tagRefs = this.$refs.tags as Vue
					if (tagRefs.$refs.multiselect instanceof Vue) {
						const multiselectRefs = tagRefs.$refs.multiselect as any
						if (multiselectRefs.search) {
							multiselectRefs.search = ''
						}
					}
				}
			}
		},
		async findTags(query: string, limit = 20) {
			this.isLoading = true
			await this.$apollo
				.query({
					query: gql`
						query FIND_TAGS($query: String!, $limit: Int) {
							tags(where: { name_contains: $query }, limit: $limit) {
								id
								name
								slug
							}
						}
					`,
					variables: { query, limit }
				})
				.then(({ data, errors }) => {
					if (errors) {
						this.$toast.error(errors[0].message)
					} else {
						this.listTags = data.tags
					}
				})
			this.isLoading = false
		},
		openSelectImage() {
			if (this.$refs.images) {
				const imageRef = this.$refs.images as HTMLInputElement
				imageRef.click()
			}
		},
		async uploadFiles(e: Event) {
			const target = e.target as HTMLInputElement
			if (target && target.files) {
				await this.processFiles(target.files)
			}
		},
		async dropFiles(e: DragEvent) {
			if (e.dataTransfer) {
				await this.processFiles(e.dataTransfer.files)
			}
		},
		getAssetType(file: File) {
			const { types } = useAssetStore()
			return types.find((type) => {
				return !!type.mimes.find((mime) => mime.mimeType === file.type)
			})
		},
		isAllowedFile(file: File) {
			return !!this.getAssetType(file)
		},
		async processFiles(files: FileList) {
			if (files.length + this.imagePreviews.length > this.MAX_FILES_ALLOWED) {
				this.$toast.error(
					`Sorry, you can only upload maximum ${this.MAX_FILES_ALLOWED} files!`
				)
				return
			}
			// check if uploaded files is allowed
			const allowedFiles = [] as File[]
			Array.from(files).forEach((file) => {
				if (!this.isAllowedFile(file)) {
					this.$toast.error(
						`Sorry, you can not upload this file "${file.name}"!`,
						{
							singleton: false
						}
					)
				} else {
					allowedFiles.push(file)
				}
			})
			this.form.files = [...this.form.files, ...allowedFiles]
			this.filePreviews = await this.getFilePreviews()
		},
		async getFilePreviews() {
			// create function with return resolved promise
			// with data:base64 string
			const getBase64 = (file: File) => {
				const reader = new FileReader()
				return new Promise<string>((resolve) => {
					reader.onload = (ev) => {
						if (ev.target?.result) {
							resolve(ev.target.result as string)
						}
					}
					reader.readAsDataURL(file)
				})
			}
			// here will be array of promisified functions
			const promises: AssetPreview[] | Promise<AssetPreview> = []

			// loop through fileList with for loop
			for (let i = 0; i < this.form.files.length; i++) {
				const file = this.form.files[i]
				const assetType = this.getAssetType(file)
				if (assetType?.value === 'pdf') {
					promises.push({
						name: file.name,
						url: '~/assets/images/icons/pdf.svg'
					})
				} else if (assetType?.value === 'csv') {
					promises.push({
						name: file.name,
						url: '~/assets/images/icons/csv.svg'
					})
				} else if (assetType?.value === 'ppt') {
					promises.push({
						name: file.name,
						url: '~/assets/images/icons/ppt.svg'
					})
				} else {
					promises.push({
						name: file.name,
						url: await getBase64(file)
					})
				}
			}

			// array with base64 strings
			return await Promise.all(promises)
		},
		removeFile(index: number) {
			if (this.currentPreviewIndex === index) {
				if (index > 0) {
					this.currentPreviewIndex = index - 1
				} else {
					this.currentPreviewIndex = 0
				}
			} else if (this.currentPreviewIndex > index) {
				this.currentPreviewIndex--
			}
			// remove from new files if removed index is new added files
			if (index >= this.assetPreviews.length) {
				this.form.files.splice(index - this.assetPreviews.length, 1)
				this.filePreviews.splice(index - this.assetPreviews.length, 1)
			}
			// on current asset previews, remove index if the pressed file is on current asset
			else {
				this.assetPreviews.splice(index, 1)
				this.assetResourceIds.splice(index, 1)
			}
		},
		validateForm() {
			if (this.form.title === '') {
				this.$toast.error('Please enter a post name!')
				return false
			} else if (this.form.title.length > 100) {
				this.$toast.error('Post name must be less than 100 characters!')
				return false
			} else if (this.form.title.length < 5) {
				this.$toast.error('Post name must be more than 5 characters!')
				return false
			}
			return true
		},
		getFormData() {
			const formData = new FormData()
			const { title, description, category, tags, files } = this.form
			const data = {
				title,
				description,
				categories: [category.id],
				tags: tags
					.map((t) => {
						// when tag is new ( id === name )
						if (t.id === t.name) {
							return { name: t.name }
						}
						return t.id
					})
					.filter((t) => t),
				types: useAssetStore()
					.getAssetTypes(files)
					.map((t) => t?.id),
				resources: [] as string[]
			}
			// on edit mode, add existing resource Ids excluding removed ids in the payload
			if (this.asset) {
				data.resources = this.assetResourceIds.filter((id) => id !== null)
			}
			files.forEach((file) => {
				formData.append('files.resources', file, file.name)
			})
			formData.append('data', JSON.stringify(data))
			return formData
		},
		async submitForm() {
			if (this.isEditMode) {
				await this.savePost()
			} else {
				await this.createPost()
			}
		},
		async createPost() {
			if (!this.validateForm()) {
				return
			}
			this.isSubmitting = true
			const formData = this.getFormData()

			await this.$strapi.$http
				.$post<IAsset>('assets', formData)
				.then(() => {
					this.$toast.success(
						'Congrats! Your asset has successfully been posted!'
					)
					this.filePreviews = []
					this.form = cloneDeep(this.initialForm)
				})
				.catch((err) => {
					this.$toast.error(err.message)
				})

			this.isSubmitting = false
		},
		async savePost() {
			if (!this.validateForm() || !this.asset) {
				return
			}
			this.isSubmitting = true
			const formData = this.getFormData()

			await this.$strapi.$http
				.$put<IAsset>(`assets/${this.asset.id}`, formData)
				.then(async (asset) => {
					this.$toast.success('Updated your post!')
					await this.$nuxt.refresh()
					Object.assign(this.$data, initData(asset))
				})
				.catch((err) => {
					this.$toast.error(err.message)
				})

			this.isSubmitting = false
		},
		async deletePost() {
			if (!this.isEditMode || !this.isOwner) {
				return
			}
			this.isSubmitting = true
			await this.$apollo
				.mutate({
					mutation: gql`
						mutation deleteAsset($id: ID!) {
							deleteAsset(input: { where: { id: $id } }) {
								__typename
							}
						}
					`,
					variables: {
						id: this.asset?.id
					}
				})
				.then(() => {
					this.$toast.success(`Deleted post ${this.asset?.title}!`)
					this.$router.push(`/profile/${this.$strapi.user.username}`)
				})
				.catch((err) => {
					this.$toast.error(err.message)
				})
			this.isSubmitting = false
		}
	}
})
</script>

<template>
	<form action="#" class="mx-auto" :class="{ submitting: isSubmitting }">
		<div class="max-w-3xl w-full mx-auto">
			<div class="mb-8">
				<h2
					class="
						text-2xl
						md:text-4xl
						font-extrabold
						leading-9
						text-gray-900 text-center
					"
				>
					{{ isEditMode ? 'Edit Your Post' : 'Upload New Post' }}
				</h2>
				<p class="mt-4 leading-5 text-gray-500 text-center">
					{{
						isEditMode
							? 'You can make a changes to your existed post here'
							: `Drag and drop up to ${MAX_FILES_ALLOWED} files to create a post`
					}}
				</p>
			</div>

			<input
				v-model="form.title"
				type="text"
				placeholder="Type a post name here..."
				class="text-xl md:text-2xl text-center block w-full outline-none mb-4"
			/>

			<div
				class="upload-workspace cursor-pointer"
				@dragover.prevent
				@drop.prevent="dropFiles"
				@click="openSelectImage"
			>
				<input
					ref="images"
					type="file"
					multiple
					class="hidden"
					@change="uploadFiles"
				/>
				<div
					v-if="imagePreviews.length && imagePreviews[currentPreviewIndex]"
					class="upload-big-preview"
					:class="{
						icon: isIcon(imagePreviews[currentPreviewIndex].url)
					}"
				>
					<CoreImage
						:src="imagePreviews[currentPreviewIndex].url"
						alt
						class="mx-auto"
					/>
					<p class="text-gray-500 mt-4">
						{{ imagePreviews[currentPreviewIndex].name }}
					</p>
				</div>
				<template v-else>
					<div class="mb-4">
						<CoreImage
							src="~/assets/images/icons/upload-img.svg"
							alt
							class="mx-auto"
						/>
					</div>
					<p class="font-medium text-gray-500 mb-3">
						<!-- on desktop -->
						<template v-if="$device.isDesktop">
							Drag & Drop an Image or
							<a href="javascript:" class="text-red-500 underline">Browse</a>
						</template>
						<template v-else>
							<a href="javascript:" class="text-red-500 underline">
								Browser from Camera Roll
							</a>
						</template>
					</p>
					<p class="text-gray-500">
						1600x1200 is recommended or higher. Max 10MB for each image
					</p>
				</template>
			</div>
			<div class="upload-gallery">
				<template v-if="imagePreviews.length > 0">
					<div
						v-for="(item, index) in imagePreviews"
						:key="index"
						class="upload-gallery-item relative"
						:class="{ active: currentPreviewIndex === index }"
					>
						<div
							class="h-full rounded-[10px] overflow-hidden"
							@click="currentPreviewIndex = index"
						>
							<CoreImage
								:src="item.url"
								alt
								:class="{
									icon: isIcon(item.url)
								}"
							/>
							<p
								v-if="isIcon(item.url)"
								class="
									text-gray-500 text-xs
									absolute
									px-4
									text-center
									w-full
									truncate
									bottom-0
								"
							>
								{{ item.name }}
							</p>
						</div>
						<span class="upload-gallery-delete" @click="removeFile(index)">
							<CoreImage
								src="~/assets/images/icons/delete.svg"
								alt="Remove asset"
							/>
						</span>
					</div>
				</template>
				<template v-else-if="!isEditMode">
					<div
						v-for="i in MAX_FILES_ALLOWED"
						:key="i"
						class="upload-gallery-item"
					></div>
				</template>
				<div
					v-if="imagePreviews.length < MAX_FILES_ALLOWED"
					class="
						upload-gallery-item
						flex
						items-center
						justify-center
						upload-gallery-item-plus
					"
					@click="openSelectImage"
				>
					<span><img src="~/assets/images/icons/plus.svg" alt="" /></span>
				</div>
			</div>
		</div>

		<div class="max-w-3xl w-full mx-auto self-center">
			<div class="mb-8">
				<label for="description" class="form-label">Post Description</label>
				<textarea
					id="description"
					v-model="form.description"
					name
					cols="30"
					rows="10"
					class="form-control"
					placeholder="Describe this post..."
				></textarea>
			</div>
			<div class="mb-8">
				<label for="categories" class="form-label">Category</label>
				<CoreFormMultiSelect
					id="categories"
					:model="form.category"
					class="form-control"
					:options="listCategories"
					:preserve-search="true"
					:multiple="false"
					:close-on-select="true"
					:clear-on-select="false"
					placeholder="Select category"
					label="title"
					track-by="slug"
					@update:model="form.category = $event"
				/>
			</div>
			<div class="mb-8">
				<label for="tags" class="form-label">Tags</label>
				<CoreFormMultiSelect
					ref="tags"
					:model="form.tags"
					:hide-content="hideTagSelection"
					class="form-control"
					:options="[]"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:hide-selected="true"
					:placeholder="`Add tags ( up to ${MAX_TAGS_ALLOWED} )`"
					label="name"
					track-by="id"
					:searchable="true"
					:loading="isLoading"
					:internal-search="false"
					:options-limit="300"
					:show-no-results="false"
					:taggable="true"
					:tag-placeholder="'Enter to add this tag'"
					:preserve-search="true"
					:max="MAX_TAGS_ALLOWED"
					@update:model="form.tags = $event"
					@tag="addTag"
					@search-change="onSearchTag"
					@input="hideTagSelection = true"
					@select="hideTagSelection = true"
					@open="hideTagSelection = true"
					@close="hideTagSelection = true"
				/>
			</div>

			<div class="mb-8 flex flex-col sm:flex-row justify-between gap-5">
				<button
					type="button"
					class="btn-primary w-full md:w-auto"
					:class="{ 'opacity-50 cursor-wait': isSubmitting }"
					:disabled="isSubmitting"
					@click="submitForm"
				>
					{{ isEditMode ? 'Save Changes' : 'Upload a Post' }}
				</button>
				<button
					v-if="isEditMode"
					type="button"
					class="btn-secondary w-full md:w-auto"
					:class="{ 'opacity-50 cursor-wait': isSubmitting }"
					:disabled="isSubmitting"
					@click="deletePost"
				>
					Delete Post
				</button>
			</div>
		</div>
	</form>
</template>
<style lang="postcss" scoped>
form.submitting {
	@apply cursor-wait;

	* {
		@apply pointer-events-none;
	}
}
.upload-big-preview {
	@apply absolute w-full h-full;
	&.icon {
		@apply p-52;

		img {
			@apply object-contain;
		}
	}
}
.upload-gallery {
	@apply grid grid-cols-3 xl:grid-cols-4 gap-4 mt-5 mb-14;
}
.upload-gallery-item {
	@apply transition ease-in-out duration-300 h-24 border-2 border-transparent rounded-[10px] bg-gray-100 cursor-pointer relative;
	@apply hover:border-brand hover:rounded-xl hover:border-solid focus:border-brand focus:border-solid;

	&.upload-gallery-item-plus {
		@apply border-dashed border-gray-300 hover:border-brand hover:border-solid;
	}
	&.active {
		@apply border-brand rounded-xl;
	}

	svg {
		@apply transition-all text-paragraph;
	}

	&:hover {
		svg {
			@apply opacity-100;
		}
	}

	img {
		@apply object-center object-cover w-full h-full;

		&.icon {
			@apply object-contain py-5;
		}
	}

	.upload-gallery-delete {
		@apply absolute -top-3 -right-3 opacity-0;
	}
	&:hover {
		.upload-gallery-delete {
			@apply opacity-100;
		}
	}
}
.upload-workspace {
	@apply overflow-hidden relative;

	img {
		@apply object-center object-cover w-full h-full;
	}
}
</style>
