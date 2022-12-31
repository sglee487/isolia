/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  safelist: [
    'border-red-500',
    'text-red-500',
    'hover:bg-red-500',
    'border-app-500',
    'text-app-500',
    'hover:bg-app-500',
    'border-gray-500',
    'text-gray-500',
    'hover:bg-gray-500',
    'border-sky-500',
    'text-sky-500',
    'hover:bg-sky-500'
    // {
    //   pattern:
    //     /(bg|border|text)-(slate|gray|zinc|neutral|stone|red|app|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|900)/,
    //   variants: ['lg', 'hover', 'focus', 'lg:hover']
    // }
  ],
  theme: {
    extend: {
      fontFamily: {
        gothica1: ['GothicA1', 'malgun gothic'],
        naverNeo: ['NaverNeo', 'malgun gothic']
      },
      minHeight: {
        '4/5': '80%'
      },
      colors: {
        'app-100': '#e2f3fe',
        'app-200': '#bae6fd',
        'app-300': '#7dd3fc',
        'app-400': '#38bdf8',
        'app-500': '#0ea5e9',
      }
    }
  },
  plugins: []
}
