/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  safelist: [
    {
      pattern:
        /(bg|border|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|900)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover']
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        gothica1: ['GothicA1', 'malgun gothic'],
        naverNeo: ['NaverNeo', 'malgun gothic']
      }
    }
  },
  plugins: []
}
