module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "import/no-named-as-default": "off",
    "import/no-mutable-exports": "off",
    "vue/no-v-html": "off"
  }
}
