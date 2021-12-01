<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { ICategory, IUser } from '~/@types'
import { useHeaderStore } from '~/stores/header'

export default Vue.extend({
  name: 'AccountProfileUpdate',
  layout: 'auth',
  middleware: 'require-login',
  data() {
    const user = this.$strapi.user as IUser
    return {
      form: {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        biography: user.biography,
        pronounces: [] as IUser['pronounces'],
        website: user.website
      },
      avatarFile: null,
      error: {
        username: {
          message: '',
          valid: false
        }
      },
      loading: false
    }
  },
  computed: {
    headerStore: () => useHeaderStore(),
    categories(): ICategory[] {
      return this.headerStore.flattenCategories
    },
    user(): IUser {
      return this.$strapi.user as IUser
    },
    pronounceList(): IUser['pronounces'] {
      return this.user.pronounces.map(item => {
        let cat: ICategory | undefined
        if (typeof item === 'string') {
          cat = this.categories.find(c => c.id === item)
        }
        else {
          cat = this.categories.find(c => c.id === item.id)
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
    openFinder() {
      if (this.$refs.avatarInput) {
        (this.$refs.avatarInput as HTMLElement).click()
      }
    },
    selectAvatar({ target: { files = [] } }: any): void {
      if (!files.length) {
        this.avatarFile = null
        return
      }
      this.avatarFile = files[0]
    },
    async uploadAvatar() {
      if (!this.avatarFile) return
      try {
        const res = await this.$apollo.mutate({
          mutation: gql`
            mutation UploadAvatar($refId: ID!, $ref:  String, $field: String, $avatar: Upload!, $source: String)  {
              upload (ref: $ref, refId: $refId, field: $field, file: $avatar, source: $source) {
                id
                width
                url
                height
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
          avatar: res.data.upload.url
        })

        if (this.$refs.avatarInput && this.$refs.avatarInput instanceof HTMLInputElement) this.$refs.avatarInput.value = ''
        this.$toast.success('Upload avatar successfully')
      } catch (err) {
        this.$toast.error(err instanceof Error ? err.message : 'Upload avatar failed')
      }
    },
    async updateProfile() {
      this.loading = true
      try {
        // update user info
        const res = await this.$apollo.mutate({
          mutation: gql`
          mutation UPDATE_PROFILE ($id: ID!, $username: String, $first_name: String, $last_name: String, $biography: String, $pronounces: [ID], $website: String) {
            updateUser(
              input: {
                where: {
                  id: $id
                },
                data: {
                  username: $username, 
                  first_name: $first_name, 
                  last_name: $last_name,
                  biography: $biography,
                  website: $website,
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
          }`,
          variables: {
            id: this.$strapi.user.id,
            username: this.form.username,
            first_name: this.form.firstName,
            last_name: this.form.lastName,
            biography: this.form.biography,
            website: this.form.website,
            pronounces: this.form.pronounces.map(pronounce => pronounce.id)
          }
        })
        await this.$strapi.setUser({
          ...this.$strapi.user,
          ...res.data.updateUser.user
        })
        this.$toast.success('Update profile successfully')
        // if avatar is selected, upload first
        await this.uploadAvatar()
      } catch (err) {
        this.$toast.error(err instanceof Error ? err.message : 'Update profile failed')
      }
      this.loading = false
    }
  }
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="mt-4 text-4xl font-extrabold leading-9 text-gray-900">Profile Information</h2>
      <p
        class="mt-4 text-sm leading-5 text-gray-500"
      >People visiting your profile will see the following info</p>
    </div>
    <div class="user-upload-avatar flex items-center space-x-5">
      <Avatar :size="72" />
      <input ref="avatarInput" type="file" class="hidden" @change="selectAvatar" />
      <button class="btn-primary" @click="openFinder">Upload Different Image</button>
    </div>
    <form class="mt-8" @submit.prevent="updateProfile">
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
        />
        <div class="flex justify-between items-center pt-4">
          <p class="text-gray-500 text-sm">
            hotasset.com/
            <strong class="text-red-500">{{ form.username || 'username' }}</strong>
          </p>
          <span
            v-if="error.username.message"
            class="text-sm"
            :class="{ 'text-green-500': error.username.valid, 'text-red-500': !error.username.valid }"
          >{{ error.username.message }}</span>
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
        <label for="pronounce" class="form-label">Pronounce</label>
        <CoreFormMultiSelect
          :model="form.pronounces"
          :preserve-search="true"
          :options="categories"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          placeholder="Select your pronouces"
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
          >Update Profile</button>
        </span>
      </div>
    </form>
  </div>
</template>