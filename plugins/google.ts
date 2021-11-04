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

const googlePlugin: Plugin = (context, inject) => {
    const googleAuth = () => {
        setTimeout(() => context.redirect(`${process.env.API_ENDPOINT}/connect/google`), 0)
    }
    inject('googleAuth', googleAuth)
}
export default googlePlugin