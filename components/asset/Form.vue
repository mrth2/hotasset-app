<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'
import { ICategory, ITag } from '~/@types'
import { useHeaderStore } from '~/stores/header'
import { useAssetStore } from '~/stores/asset'
import { IAsset } from '~/@types/asset'
export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<IAsset>,
			default() {
				return {} as IAsset
			}
		}
	},
	data() {
		const initialForm = {
			title: this.asset?.title || '',
			description: this.asset?.description || '',
			categories: this.asset?.categories || ([] as ICategory[]),
			tags: this.asset?.tags || ([] as ITag[]),
			files: [] as File[]
		}
		return {
			initialForm,
			form: cloneDeep(initialForm),
			imagesPreview: [] as string[],
			currentPreviewIndex: 0,
			listTags: [] as ITag[],
			isLoading: false,
			isSubmitting: false
		}
	},
	async fetch() {
		await this.findTags('', 10)
		await useAssetStore().fetchAssetMetaData()
	},
	computed: {
		listCategories(): ICategory[] {
			return useHeaderStore().flattenCategories
		},
		isEditMode(): boolean {
			return !!this.asset?.id
		}
	},
	methods: {
		addTag(name: string) {
			this.form.tags.push({
				id: name,
				name,
				slug: name
			})
			return true
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
				;(this.$refs.images as HTMLInputElement).click()
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
			if (files.length + this.form.files.length > 6) {
				this.$toast.error('Sorry, you can only upload maximum 6 files!')
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
			this.imagesPreview = await this.getFilePreviews()
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
			const promises: string[] | Promise<string> = []

			// loop through fileList with for loop
			for (let i = 0; i < this.form.files.length; i++) {
				const file = this.form.files[i]
				const assetType = this.getAssetType(file)
				if (assetType?.value === 'pdf') {
					promises.push(require('~/assets/images/icons/pdf.svg'))
				} else if (assetType?.value === 'csv') {
					promises.push(require('~/assets/images/icons/csv.svg'))
				} else if (assetType?.value === 'ppt') {
					promises.push(require('~/assets/images/icons/ppt.svg'))
				} else {
					promises.push(await getBase64(file))
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
			this.form.files.splice(index, 1)
			this.imagesPreview.splice(index, 1)
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
			const { title, description, categories, tags, files } = this.form

			const data = {
				title,
				description,
				categories: categories.map((c) => c.id),
				tags: tags.map((t) => {
					// when tag is new ( id === name )
					if (t.id === t.name) {
						return { name: t.name }
					}
					return t.id
				}),
				types: useAssetStore()
					.getAssetTypes(files)
					.map((t) => t?.id)
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
					this.$toast.success('Congrats! Your assets is successfully posted!')
					this.imagesPreview = []
					this.form = cloneDeep(this.initialForm)
				})
				.catch((err) => {
					this.$toast.error(err.message)
				})

			this.isSubmitting = false
		},
		async savePost() {
			if (!this.validateForm()) {
				return
			}
			this.isSubmitting = true
			const formData = this.getFormData()

			await this.$strapi.$http
				.$put<IAsset>(`assets/${this.asset.id}`, formData)
				.then(() => {
					this.$toast.success('Updated your post!')
					this.$nuxt.refresh()
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
	<form action="#" class="mx-auto" :class="{ 'cursor-wait': isSubmitting }">
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
							: 'Drag and drop up to 6 images to create a post'
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
				:class="{ 'cursor-wait pointer-events-none': isSubmitting }"
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
					v-if="imagesPreview.length && imagesPreview[currentPreviewIndex]"
					class="upload-big-preview"
					:class="{
						icon: imagesPreview[currentPreviewIndex].includes('_nuxt')
					}"
				>
					<CoreImage
						:src="imagesPreview[currentPreviewIndex]"
						alt
						class="mx-auto"
					/>
					<p class="text-gray-500 mt-4">
						{{ form.files[currentPreviewIndex].name }}
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
						Drag & Drop an Image or
						<a href="javascript:" class="text-red-500 underline">Browse</a>
					</p>
					<p class="text-gray-500">
						1600x1200 is recommended or higher. Max 10MB for each image
					</p>
				</template>
			</div>
			<div class="upload-gallery">
				<template v-if="form.files.length === 0">
					<div v-for="i in 6" :key="i" class="upload-gallery-item"></div>
				</template>
				<template v-else>
					<div
						v-for="(file, index) in form.files"
						:key="index"
						class="upload-gallery-item relative"
					>
						<template v-if="imagesPreview[index]">
							<div class="h-full" @click="currentPreviewIndex = index">
								<CoreImage
									:src="imagesPreview[index]"
									alt
									:class="{ icon: imagesPreview[index].includes('_nuxt') }"
								/>
								<p
									v-if="imagesPreview[index].includes('_nuxt')"
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
									{{ file.name }}
								</p>
							</div>
							<FontAwesomeIcon
								class="absolute top-1 right-1 opacity-0"
								:icon="['far', 'times-circle']"
								size="lg"
								@click="removeFile(index)"
							/>
						</template>
					</div>
				</template>
			</div>
		</div>

		<div class="w-full mx-auto self-center">
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
					:model="form.categories"
					class="form-control"
					:options="listCategories"
					:preserve-search="true"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					placeholder="Select category"
					label="title"
					track-by="slug"
					@update:model="form.categories = $event"
				/>
			</div>
			<div class="mb-8">
				<label for="tags" class="form-label">Tags</label>
				<CoreFormMultiSelect
					:model="form.tags"
					class="form-control"
					:options="listTags"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:hide-selected="true"
					placeholder="Add tags (separate by comma)"
					label="name"
					track-by="id"
					:searchable="true"
					:loading="isLoading"
					:internal-search="false"
					:options-limit="300"
					:show-no-results="false"
					:taggable="true"
					:tag-placeholder="'Add tags (separate by comma)'"
					:max="10"
					@update:model="form.tags = $event"
					@tag="addTag"
					@search-change="findTags"
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
					type="button"
					class="btn-secondary w-full md:w-auto"
					:class="{ 'opacity-50 cursor-wait': isSubmitting }"
					:disabled="isSubmitting"
					@click="submitForm"
				>
					Delete Post
				</button>
			</div>
		</div>
	</form>
</template>
<style lang="postcss" scoped>
.upload-big-preview {
	@apply absolute w-full h-full;
	&.icon {
		@apply p-52;

		img {
			@apply object-contain;
		}
	}
}
.upload-gallery-item {
	@apply overflow-hidden cursor-pointer;

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
}
.upload-workspace {
	@apply overflow-hidden relative;

	img {
		@apply object-center object-cover w-full h-full;
	}
}
</style>
