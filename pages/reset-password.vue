<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: 'ResetPassword',
    layout: 'auth',
    middleware: 'authenticated',
    data() {
        return {
            email: '',
            error: '',
            loading: false,
            // reset new password
            password: '',
            passwordConfirmation: ''
        }
    },
    computed: {
        code() {
            return this.$route.query.code
        }
    },
    methods: {
        isResetMode() {
            return this.code && this.code !== ''
        },
        isButtonDisabled() {
            if (this.isResetMode()) {
                return this.password === '' || this.passwordConfirmation === ''
            }
            else {
                return this.email === '' || this.loading
            }
        },
        resetPassword() {
            if (this.isResetMode()) this.requestUpdatePassword()
            else this.sendEmailResetPassword()
        },
        async sendEmailResetPassword() {
            this.loading = true
            try {
                await this.$strapi.forgotPassword({
                    email: this.email
                })
                this.$toast.success('Email sent! Please check your email and follow our instructions.')
                this.email = ''
            } catch (error) {
                if (error instanceof Error) {
                    this.$toast.error(error.message)
                }
                else {
                    this.$toast.global.unknown_error()
                }
            }
            this.loading = false
        },
        async requestUpdatePassword() {
            this.loading = true
            try {
                await this.$strapi.resetPassword({
                    code: this.code.toString(),
                    password: this.password,
                    passwordConfirmation: this.passwordConfirmation
                })
                this.$toast.success('Password reset', {
                    action: {
                        text: 'Login Now',
                        onClick: () => {
                            this.$router.push({
                                name: 'login'
                            })
                        }
                    }
                })
                this.password = ''
                this.passwordConfirmation = ''
            } catch (err) {
                if (err instanceof Error) {
                    this.$toast.error(err.message)
                }
                else {
                    this.$toast.global.unknown_error()
                }
            }
        }
    }
})
</script>
<template>
    <div>
        <div class="mb-8">
            <h2 class="auth__title">Reset Password</h2>
            <p class="auth__desc">
                Remembered a password?
                <NuxtLink
                    :to="{ name: 'login' }"
                    class="font-medium text-red-500 transition duration-150 ease-in-out hover:underline"
                >Sign In</NuxtLink>
            </p>
        </div>
        <form class="mt-12">
            <!-- for reset password form -->
            <template v-if="isResetMode()">
                <div class="mb-8">
                    <label
                        for="password"
                        class="form-label"
                    >New Password</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        class="form-control"
                        placeholder="Enter a new password"
                        @keyup.enter.native="resetPassword()"
                    />
                </div>
                <div class="mb-8">
                    <label
                        for="passwordConfirmation"
                        class="form-label"
                    >Confirm New Password</label>
                    <input
                        id="passwordConfirmation"
                        v-model="passwordConfirmation"
                        type="password"
                        required
                        class="form-control"
                        placeholder="Enter it again"
                        @keyup.enter.native="resetPassword()"
                    />
                </div>
            </template>
            <!-- request for reset password link -->
            <div v-else class="mb-8">
                <label
                    for="email"
                    class="form-label"
                >Email associated with your account</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="form-control"
                    placeholder="example@example.com"
                    @keyup.enter.native="resetPassword()"
                />
            </div>
            <div class="mt-8">
                <span class="rounded-md shadow-sm">
                    <button
                        type="button"
                        class="px-4 py-3 text-base bg-red-500 font-medium leading-6 text-white whitespace-no-wrap transition duration-150 ease-in-out rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-blue active:bg-red-600"
                        :disabled="isButtonDisabled()"
                        :class="{ 'opacity-50': isButtonDisabled() }"
                        @click="resetPassword"
                    >Reset Password</button>
                </span>
            </div>
        </form>
    </div>
</template>
<style>
</style>