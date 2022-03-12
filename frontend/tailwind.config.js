const windmill = require('@windmill/react-ui/config')

module.exports = windmill({
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      colors: {
        'alt-green': '#409047',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
})
