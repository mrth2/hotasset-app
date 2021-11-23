require('dotenv').config()
const path = require('path')

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    CLOUDINARY_URL: 'https://res.cloudinary.com/hotasset-com/image/upload'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'HotAsset',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vue-multiselect/dist/vue-multiselect.min.css',
    'v-tooltip/dist/v-tooltip.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/google.ts', mode: 'client' },
    { src: '~/plugins/v-tooltip.ts', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/dotenv',
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: true }],
  ],

  fontawesome: {
    icons: {
      brands: ['faFacebook', 'faTwitter', 'faDribbble', 'faInstagram'],
      regular: ['faUserCircle', 'faTimesCircle'],
      solid: ['faFire']
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    '@nuxtjs/strapi',
    '@nuxtjs/toast',
    'nuxt-webfontloader',
    '@nuxt/image',
    '@nuxtjs/fontawesome'
  ],

  image: {
    provider: 'ipx',
    dir: 'assets/images',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/hotasset-com/image/upload/'
    }
  },

  webfontloader: {
    google: {
      families: ['Roboto:400,500,700']
    }
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${process.env.API_ENDPOINT}/graphql` || 'https://hotasset.herokuapp.com/graphql',
        tokenName: 'strapi_jwt'
      }
    },
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'no-cache',
      },
    },
  },

  strapi: {
    entities: ['users'],
    url: process.env.API_ENDPOINT || 'https://hotasset.herokuapp.com'
  },

  toast: {
    position: 'top-center',
    duration: 5000,
    keepOnHover: true,
    // singleton: true,
    register: [
      {
        name: 'unknown-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        'postcss-nested': {}
      }
    },
    preset: {
      stage: 1
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          tailwindConfig: {
            test: /tailwind\.config/,
            chunks: 'all',
            priority: 10,
            name: true
          }
        }
      }
    }
  }
}
