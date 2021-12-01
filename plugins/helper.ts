import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { IUser } from '~/@types'

declare module 'vue/types/vue' {
  interface Vue {
    $displayName(user: IUser): string
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $displayName(user: IUser): string
  }
  interface Context {
    $displayName(user: IUser): string
  }
}

export default function (_context: Context, inject: Inject) {
  inject('displayName', (user: IUser) => {
    if (user) {
      if (user.first_name && user.last_name) {
        return user.first_name + ' ' + user.last_name
      }
      else if (user.last_name) {
        return user.last_name
      }
      else if (user.first_name) {
        return user.first_name
      }
    }
    return user.username
  })
}