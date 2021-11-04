import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

declare module 'vue/types/vue' {
    interface Vue {
        $googleAuth(): void
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $googleAuth(): void
    }
    interface Context {
        $googleAuth(): void
    }
}

export default function (context: Context, inject: Inject) {
    inject('googleAuth', () => {
        window.location.href = `${context.$strapi.options.url}/connect/google`
    })
}