<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'Header',
    computed: {
        headerCategories() {
            return this.$store.state.header.categories
        }
    },
    methods: {
        async logout() {
            await this.$strapi.logout()
            this.$nuxt.refresh()
        }
    }
})
</script>

<template>
    <header>
        <div class="relative bg-white">
            <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
                <div
                    class="flex justify-between items-center border-b border-gray-100 py-4 md:justify-start md:space-x-10"
                >
                    <div class="flex justify-start items-center">
                        <NuxtLink to="/">
                            <span class="sr-only">HotAsset</span>
                            <img srcset="~/assets/images/logo.png 2x" alt />
                        </NuxtLink>
                    </div>
                    <form action class="form-search lg:w-0 lg:flex-1">
                        <div class="ml-12 flex rounded-md shadow-sm">
                            <button
                                class="inline-flex items-center px-4 rounded-l-md bg-gray-100 text-gray-500 text-sm"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    class="text-gray-400 group-focus-within:text-gray-500 transition-colors duration-150"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <input
                                type="text"
                                name="company-website"
                                id="company-website"
                                class="outline-none bg-gray-100 flex-1 block w-1/2 py-3 pr-4 rounded-none rounded-r-md sm:text-sm"
                                placeholder="Search HotAsset..."
                            />
                        </div>
                    </form>
                    <div class="-mr-2 -my-2 md:hidden">
                        <button
                            type="button"
                            class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span class="sr-only">Open menu</span>
                            <!-- Heroicon name: outline/menu -->
                            <svg
                                class="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                        <a
                            href="#"
                            class="whitespace-nowrap text-base font-medium text-gray-900 hover:underline"
                        >About</a>
                        <template v-if="!$strapi.user">
                            <NuxtLink
                                :to="{ name: 'login' }"
                                class="ml-8 whitespace-nowrap text-base font-medium text-gray-900 hover:underline"
                            >Sign in</NuxtLink>
                            <NuxtLink
                                :to="{ name: 'signup' }"
                                class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-700"
                            >Sign up</NuxtLink>
                        </template>
                        <template v-else>
                            <button
                                class="ml-8 whitespace-nowrap text-base font-medium text-gray-900 hover:underline"
                                @click="logout"
                            >Logout</button>
                        </template>
                    </div>
                </div>
                <div class="navbar-scroll max-w-full overflow-hidden">
                    <ul
                        class="navbar flex flex-row overflow-x-auto whitespace-nowrap justify-between py-4 -ml-4"
                    >
                        <li v-for="category in headerCategories" :key="category.slug">
                            <a
                                href="#"
                                class="navbar__link text-gray-500 text-base font-medium px-4"
                            >
                                <span>{{ category.title }}</span>
                                <span
                                    v-if="category.is_new"
                                    class="rounded-xl ml-1.5 mb-1 border border-red-500 text-xxs text-red-500 uppercase px-1.5 py-0.25"
                                >New</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>