<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: 'Login',
    layout: 'auth',
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
            } catch (error: any) {
                this.error = error.message
            }
            this.loading = false
        }
    }
})
</script>
<template>
    <div>
        <div class="mb-8">
            <h2 class="auth__title">Sign in to HotAsset</h2>
            <p class="auth__desc">
                Not a member?
                <NuxtLink
                    :to="{ name: 'signup' }"
                    class="auth__note"
                >Register Now</NuxtLink>
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
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    v-model="identifier"
                    type="email"
                    required
                    class="form-control"
                    placeholder="youremail@gmail.com"
                />
            </div>
            <div class="mb-8">
                <label for="password" class="form-label">Password</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    class="form-control"
                    placeholder="At least 6 characters"
                />
            </div>

            <div class="mt-8">
                <p for="accept-term" class="text-sm text-gray-600">
                    Forgot a password?
                    <NuxtLink
                        :to="{ name: 'reset-password' }"
                        class="font-medium underline transition duration-150 ease-in-out text-brand hover:text-gray-500"
                    >Reset Password</NuxtLink>
                </p>
            </div>
            <div class="mt-8">
                <p v-if="error" class="text-red-500 underline mb-2">{{ error }}</p>
                <span class="rounded-md shadow-sm">
                    <button
                        type="button"
                        class="btn-primary w-full md:w-auto"
                        :disabled="isButtonDisabled()"
                        :class="{ 'opacity-50': isButtonDisabled() }"
                        @click="loginUser"
                    >Sign in</button>
                </span>
            </div>
        </form>
    </div>
</template>
<style>
</style>