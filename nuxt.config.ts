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

  loading: {
    color: '#FF5864',
    height: '3px',
    continuous: true,
    throttle: 0
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/helper.ts' },
    { src: '~/plugins/google.ts', mode: 'client' },
    { src: '~/plugins/v-tooltip.ts', mode: 'client' },
    { src: '~/plugins/directive.js', mode: 'client' }
  ],

  router: {
    middleware: ['nuxt-server-init']
  },

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
    '@nuxtjs/device',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  fontawesome: {
    icons: {
      brands: ['faFacebook', 'faTwitter', 'faDribbble', 'faInstagram'],
      regular: ['faUserCircle'],
      solid: ['faFire', 'faPen']
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/strapi',
    '@nuxtjs/toast',
    'nuxt-webfontloader',
    '@nuxt/image',
    '@nuxtjs/fontawesome'
  ],

  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
      '3xl': 1920
    },
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
        tokenName: 'hotasset-jwt'
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
    url: process.env.API_ENDPOINT || 'https://hotasset.herokuapp.com',
    key: 'hotasset-jwt',
    expires: '31d',
    cookie: {
      sameSite: true,
      path: '/'
    }
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
