<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import Multiselect from 'vue-multiselect'
import { ICategory, ITag } from '~/@types'
import { useHeaderStore } from '~/stores/header'

export default Vue.extend({
	components: {
		Multiselect
	},
	middleware: 'require-login',
	data() {
		return {
			form: {
				categories: null,
				tags: [] as ITag[],
				images: [] as unknown as FileList
			},
			imagesPreview: [] as string[],
			currentPreviewIndex: 0,
			listTags: [] as ITag[],
			isLoading: false
		}
	},
	async fetch() {
		await this.findTags('', 10)
	},
	computed: {
		headerStore: () => useHeaderStore(),
		listCategories(): ICategory[] {
			return this.headerStore.flattenCategories
		}
	},
	watch: {
		form: {
			handler() {
				console.log(this.form)
			},
			deep: true
		}
	},
	methods: {
		async addTag(name: string) {
			this.isLoading = true
			const newTagIndex = this.form.tags.push({
				id: name,
				name,
				slug: name
			})
			// create tag
			const { data, errors } = await this.$apollo.mutate({
				mutation: gql`
						mutation CREATE_TAG ($name: String!) {
							newTag: createTag (input: { data: { name: $name }}) {
								tag {
									id
									name
									slug
								}
							}
						}
					`,
				variables: { name }
			})
			if (errors) {
				this.$toast.error(errors[0].message)
			}
			else {
				this.listTags.push(data.newTag.tag)
			}
			this.form.tags[newTagIndex - 1] = data.newTag.tag
			this.isLoading = false
			return true
		},
		async findTags(query: string, limit = 20) {
			this.isLoading = true
			await this.$apollo.query({
				query: gql`
					query FIND_TAGS ($query: String!, $limit: Int) {
						tags (where: {name_contains: $query}, limit: $limit) {
							id
							name
							slug
						}
					}
				`,
				variables: { query, limit }
			}).then(({ data, errors }) => {
				if (errors) {
					this.$toast.error(errors[0].message)
				}
				else {
					this.listTags = data.tags
				}
			})
			this.isLoading = false
		},
		openSelectImage() {
			if (this.$refs.images) {
				(this.$refs.images as HTMLInputElement).click()
			}
		},
		async uploadImages(e: Event) {
			const target = e.target as HTMLInputElement
			if (target && target.files) {
				this.form.images = target.files
				this.imagesPreview = await this.getImagesPreview()
			}
		},
		async dragImages(e: DragEvent) {
			if (e.dataTransfer) {
				this.form.images = e.dataTransfer.files
				this.imagesPreview = await this.getImagesPreview()
			}
		},
		async getImagesPreview() {
			// create function with return resolved promise
			// with data:base64 string
			function getBase64(file: File) {
				const reader = new FileReader()
				return new Promise<string>(resolve => {
					reader.onload = ev => {
						if (ev.target?.result) {
							resolve(ev.target.result as string)
						}
					}
					reader.readAsDataURL(file)
				})
			}
			// here will be array of promisified functions
			const promises = []

			// loop through fileList with for loop
			for (let i = 0; i < this.form.images.length; i++) {
				promises.push(getBase64(this.form.images[i]))
			}

			// array with base64 strings
			return await Promise.all(promises)
		}
	}
})
</script>
<template>
	<main class="border-t relative">
		<div class="container mx-auto px-5 relative">
			<div class="back xl:absolute mt-8 left-6">
				<a href class="text-gray-500 inline-flex items-center">
					<img src="~/assets/images/icons/arrow-left.svg" class="inline-block mr-2" alt />
					Back
				</a>
			</div>
			<div class="content py-10">
				<form action="#" class="mx-auto">
					<div class="max-w-3xl mx-auto">
						<div class="mb-8">
							<h2
								class="text-2xl md:text-4xl font-extrabold leading-9 text-gray-900 text-center"
							>Upload New Post</h2>
							<p
								class="mt-4 leading-5 text-gray-500 text-center"
							>Drag and drop up to 6 images to create a post</p>
						</div>

						<input
							type="text"
							placeholder="Type a post name here..."
							class="text-xl md:text-2xl text-center block w-full outline-none mb-4"
						/>

						<div
							class="upload-workspace cursor-pointer"
							@dragover.prevent
							@drop.prevent="dragImages"
							@click="openSelectImage"
						>
							<input ref="images" type="file" multiple class="hidden" @change="uploadImages" />
							<div v-if="imagesPreview.length" class="absolute w-full h-full">
								<img :src="imagesPreview[currentPreviewIndex]" alt class="mx-auto" />
							</div>
							<div v-else class="mb-4">
								<img src="~/assets/images/icons/upload-img.svg" alt class="mx-auto" />
							</div>
							<p class="font-medium text-gray-500 mb-3">
								Drag & Drop an Image or
								<a href="javascript:" class="text-red-500 underline">Browse</a>
							</p>
							<p class="text-gray-500">1600x1200 is recommended or higher. Max 10MB for each image</p>
						</div>
						<div class="upload-gallery">
							<template v-if="form.images.length === 0">
								<div v-for="i in 6" :key="i" class="upload-gallery-item"></div>
							</template>
							<template v-else>
								<div
									v-for="(image, index) in Array.from(form.images)"
									:key="index"
									class="upload-gallery-item"
									@click="currentPreviewIndex = index"
								>
									<img v-if="imagesPreview[index]" :src="imagesPreview[index]" alt />
								</div>
							</template>
						</div>
					</div>

					<div class="w-full sm:max-w-lg mx-auto self-center">
						<div class="mb-8">
							<label for="bio" class="form-label">Post Description</label>
							<textarea
								id="bio"
								name
								cols="30"
								rows="10"
								class="form-control"
								placeholder="Describe this post..."
							></textarea>
						</div>
						<div class="mb-8">
							<label for="categories" class="form-label">Category</label>
							<Multiselect
								id="categories"
								v-model="form.categories"
								class="form-control"
								:options="listCategories"
								:preserve-search="true"
								:multiple="true"
								:close-on-select="false"
								:clear-on-select="false"
								placeholder="Select category"
								label="title"
								track-by="slug"
							/>
						</div>
						<div class="mb-8">
							<label for="tags" class="form-label">Tags</label>
							<Multiselect
								v-model="form.tags"
								class="form-control"
								:options="listTags"
								:preserve-search="true"
								:multiple="true"
								:close-on-select="false"
								:clear-on-select="false"
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
								@tag="addTag"
								@search-change="findTags"
							/>
						</div>

						<div class="mb-8">
							<span class="rounded-md shadow-sm">
								<button type="button" class="btn-primary w-full md:w-auto">Upload a Post</button>
							</span>
						</div>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>

<style lang="postcss" scoped>
::v-deep .multiselect__tags {
	@apply border-0 border-none bg-transparent pb-0 h-auto min-h-0;
}
::v-deep .multiselect__tag {
	@apply bg-tag text-black py-2.5;
	.multiselect__tag-icon {
		@apply hover:bg-transparent;

		&:after {
			@apply text-black;
		}
	}
}
/* ::v-deep .multiselect__option--highlight {
	@apply bg-tag;
} */
::v-deep .multiselect__input {
	@apply bg-transparent;
}
.form-control.multiselect {
	@apply py-0;
	min-height: 40px;
}
.upload-gallery-item {
	@apply overflow-hidden cursor-pointer;

	img {
		@apply object-center object-cover w-full h-full;
	}
}
.upload-workspace {
	@apply overflow-hidden relative;

	img {
		@apply object-center object-cover w-full h-full;
	}
}
</style>