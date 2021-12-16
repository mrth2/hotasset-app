const colors = {
  'paragraph': '#6E6D7A',
  'brand': '#FF5864',
  'title': '#0D0C22',
  'grey': '#BFBFC2',
  'form-control': '#F8F9FD',
  'tag': '#E7E7E9'
}
module.exports = {
  mode: 'jit',
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
      },
      colors
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'hover'],
      ringWidth: ['active', 'hover'],
      ringColor: ['active', 'hover'],
      scale: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
