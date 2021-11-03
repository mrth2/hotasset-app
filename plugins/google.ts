import { Plugin } from '@nuxt/types'

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

const googlePlugin: Plugin = (_context, inject) => {
    inject('googleAuth', () => {
        window.location.href = process.env.API_ENDPOINT + '/connect/google'
    })
}
export default googlePlugin