module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'xxs': ['9px', {
          letterSpacing: '-0.01em'
        }]
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
