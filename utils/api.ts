import type { NuxtApolloConfiguration } from '@nuxtjs/apollo/types/nuxt'
import type { DollarApollo } from 'vue-apollo/types/vue-apollo'

let $apollo: DollarApollo

export function initializeApollo(apolloInstance: NuxtApolloConfiguration) {
  $apollo = apolloInstance
}

export { $apollo }

declare module '@nuxt/types' {
  interface Context {
    $apollo: NuxtApolloConfiguration
  }
}