<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: 'Login',
    middleware: 'authenticated',
    data() {
        return {
            identifier: '',
            password: '',
            error: '',
            loading: false
        }
    },
    methods: {
        isButtonDisabled() {
            return this.identifier === '' || this.password === '' || this.loading
        },
        async loginUser() {
            this.loading = true
            try {
                const user = await this.$strapi.login({
                    identifier: this.identifier,
                    password: this.password,
                })
                if (user !== null) {
                    this.error = ''
                    this.$nuxt.$router.push('/')
                }
            } catch (error) {
                this.error = 'Error in login credentials'
            }
            this.loading = false
        }
    }
})
</script>
<template>
    <main class="border-t relative">
        <div class="max-w-screen-xl mx-auto px-5">
            <div class="content py-10 flex justify-between">
                <aside class="hidden lg:block pt-12">
                    <h2 class="text-4xl font-bold">
                        <span class="text-gray-600 lg:block mb-2">Welcome to</span>
                        <span class="text-gray-900">HotAsset</span>
                    </h2>
                </aside>

                <div class="w-full sm:max-w-lg mx-auto lg:mr-40 self-center">
                    <div class="mb-8">
                        <h2
                            class="mt-4 text-4xl font-extrabold leading-9 text-gray-900"
                        >Sign in to HotAsset</h2>
                        <p class="mt-4 text-sm leading-5 text-gray-600">
                            Not a member?
                            <a
                                href="#"
                                class="font-medium text-red-500 transition duration-150 ease-in-out hover:underline"
                            >Register Now</a>
                        </p>
                        <button
                            type="button"
                            class="block w-full px-3 py-3 mt-6 text-base font-medium leading-6 text-white whitespace-no-wrap transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none active:bg-blue-700"
                            @click="$googleAuth"
                        >Sign in with Google</button>
                    </div>
                    <div class="or relative block text-center">
                        <span class="bg-white inline-block p-3 relative text-gray-400">or</span>
                    </div>
                    <form action="#" class="mt-8">
                        <div class="mb-8">
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                v-model="identifier"
                                type="email"
                                required
                                class="block text-sm mt-1 shadow-sm form-input bg-gray-100 rounded w-full py-3 px-4"
                                placeholder="youremail@gmail.com"
                            />
                        </div>
                        <div class="mb-8">
                            <label
                                for="password"
                                class="block text-sm font-medium text-gray-700"
                            >Password</label>
                            <input
                                id="password"
                                v-model="password"
                                type="password"
                                required
                                class="block text-sm mt-1 shadow-sm form-input bg-gray-100 rounded w-full py-3 px-4"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div class="mt-8">
                            <p for="accept-term" class="text-sm text-gray-600">
                                Forgot a password?
                                <a
                                    href="#"
                                    class="font-medium underline transition duration-150 ease-in-out text-red-500 hover:text-gray-500"
                                >Reset Password</a>
                            </p>
                        </div>
                        <div class="mt-8">
                            <span class="rounded-md shadow-sm">
                                <button
                                    type="button"
                                    class="px-4 py-3 text-base bg-red-500 font-medium leading-6 text-white whitespace-no-wrap transition duration-150 ease-in-out rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-blue active:bg-red-600"
                                    :disabled="isButtonDisabled()"
                                    :class="{ 'opacity-50': isButtonDisabled() }"
                                    @click="loginUser"
                                >Sign in</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <img
            srcset="~/assets/images/social-media-instagram-digital-marketing-concept-3d-rendering.png 2x"
            alt
            class="absolute bottom-0 left-0 hidden w-3/12 lg:block xl:w-auto"
        />
    </main>
</template>
<style>
</style>