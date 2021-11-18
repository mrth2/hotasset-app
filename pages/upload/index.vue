<script lang="ts">
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import { ICategory } from '~/@types'
import { useHeaderStore } from '~/stores/header'

export default Vue.extend({
    components: {
        Multiselect
    },
    middleware: 'require-login',
    data() {
        return {
            category: null
        }
    },
    computed: {
        headerStore: () => useHeaderStore(),
        categories(): ICategory[] {
            return this.headerStore.categories
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
                    back
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

                        <div class="upload-workspace">
                            <div class="mb-4">
                                <img src="~/assets/images/icons/upload-img.svg" alt class="mx-auto" />
                            </div>
                            <p class="font-medium text-gray-500 mb-3">
                                Drag & Drop an Image or
                                <a
                                    href="#"
                                    class="text-red-500 underline"
                                >Browse</a>
                            </p>
                            <p
                                class="text-gray-500"
                            >1600x1200 is recommended or higher. Max 10MB for each image</p>
                        </div>
                        <div class="upload-gallery">
                            <div class="upload-gallery-item"></div>
                            <div class="upload-gallery-item"></div>
                            <div class="upload-gallery-item"></div>
                            <div class="upload-gallery-item"></div>
                            <div class="upload-gallery-item"></div>
                            <div class="upload-gallery-item"></div>
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
                                placeholder="Tell about yourself"
                            ></textarea>
                        </div>
                        <div class="mb-8">
                            <label for="pronounce" class="form-label">Category</label>
                            <Multiselect
                                v-model="category"
                                :options="categories"
                                :multiple="true"
                                group-values="sub_categories"
                                group-label="title"
                                :group-select="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                placeholder="Type to search"
                                track-by="slug"
                                label="title"
                            />
                        </div>
                        <div class="mb-8">
                            <label for="tags" class="form-label">Tags</label>
                            <input id="tags" type="text" class="form-control" />
                        </div>

                        <div class="mb-8">
                            <span class="rounded-md shadow-sm">
                                <button
                                    type="button"
                                    class="btn-primary w-full md:w-auto"
                                >Upload a Post</button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>