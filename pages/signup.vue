<template>
  <div>
    <div class="mb-8">
      <h2 class="auth__title">Register to HotAsset</h2>
      <p class="auth__desc">
        Already a member?
        <NuxtLink :to="{ name: 'login' }" class="auth__note">Sign In</NuxtLink>
      </p>
      <button
        type="button"
        class="block w-full px-3 py-3 mt-6 text-base font-medium leading-6 text-white whitespace-no-wrap transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none active:bg-blue-700"
        @click="$googleAuth()"
      >Sign in with Google</button>
    </div>
    <div class="or relative block text-center">
      <span class="bg-white inline-block p-3 relative text-gray-400">or</span>
    </div>
    <form class="mt-8" @submit.prevent="createUser">
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label for="first-name" class="form-label">
            First
            Name
          </label>
          <input
            id="first-name"
            v-model="firstName"
            type=" text"
            required
            class="form-control"
            placeholder="Nick"
            oninvalid="setCustomValidity('Please enter a first name')"
            oninput="setCustomValidity('')"
          />
        </div>
        <div>
          <label for="last-name" class="form-label">
            Last
            Name
          </label>
          <input
            id="last-name"
            v-model="lastName"
            type="text"
            required
            class="form-control"
            placeholder="Snow"
            oninvalid="setCustomValidity('Please enter a last name')"
            oninput="setCustomValidity('')"
          />
        </div>
      </div>
      <div class="mb-8">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="form-control"
          placeholder="example@gmai.com"
          oninvalid="setCustomValidity('Please enter an email address')"
          oninput="setCustomValidity('')"
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
          oninvalid="setCustomValidity('Please enter a password')"
          oninput="setCustomValidity('')"
        />
      </div>
      <div class="mt-8">
        <input id="accept-term" v-model="termAgreed" type="checkbox" />
        <label for="accept-term" class="text-sm text-gray-600">
          I accept your
          <NuxtLink
            to="/terms"
            class="font-medium underline transition duration-150 ease-in-out text-red-500 hover:text-gray-500"
          >Terms of Service</NuxtLink>
          and
          <NuxtLink
            to="/privacy"
            class="font-medium underline transition duration-150 ease-in-out text-red-500 hover:text-gray-500"
          >Privacy Policy terms</NuxtLink>.
        </label>
      </div>
      <div class="mt-8">
        <p v-if="error" class="text-red-500 mb-2">{{ error }}</p>
        <span class="rounded-md shadow-sm">
          <button
            type="submit"
            class="px-4 py-3 text-base bg-red-500 font-medium leading-6 text-white whitespace-no-wrap transition duration-150 ease-in-out rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-blue active:bg-red-600"
            :disabled="loading || !termAgreed"
            :class="{ 'opacity-50 cursor-wait': loading, 'opacity-50 cursor-not-allowed': !termAgreed }"
          >Create an account</button>
        </span>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'auth',
  middleware: 'authenticated',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      error: '',
      loading: false,
      termAgreed: false
    }
  },
  methods: {
    validateForm() {
      if (this.firstName === '') {
        this.error = 'Please enter your first name'
      }
      else if (this.lastName === '') {
        this.error = 'Please enter your last name'
      }
      else if (this.email === '') {
        this.error = 'Please enter an email address'
      }
      else if (this.password === '') {
        this.error = 'Please enter a password'
      }
      if (this.error) {
        this.$toast.error(this.error)
        return false
      }
      return true
    },
    async createUser() {
      if (!this.validateForm()) {
        return
      }
      this.error = ''
      this.loading = true
      await this.$strapi.$http.$post('/auth/local/register', {
        email: this.email,
        username: this.email,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName
      }).then(() => {
        this.$nuxt.$router.push('/login')
      }).catch((error) => {
        this.error = error instanceof Error ? error.message : 'Something went wrong. Please try again!'
      })
      this.loading = false
    },
  },
})
</script>
<style>
</style>