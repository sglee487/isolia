/** @type {import('tailwindcsOranges').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  safelist: [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#008000', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#EE82EE', // Violet
    '#FFC0CB', // Pink
    '#00FFFF', // Cyan
    '#800080', // Purple
    '#FF6347', // Tomato
    '#008080', // Teal
    '#8B0000', // Dark Red
    '#00FF7F', // Spring Green
    '#800000', // Maroon
    '#00CED1', // Dark Turquoise
    '#B22222', // Firebrick
    '#FF4500', // Orange Red
    '#1E90FF', // Dodger Blue
    'border-red-500',
    'text-red-500',
    'hover:bg-red-500',
    'border-app-500',
    'text-app-500',
    'border-gray-500',
    'text-gray-500',
    'hover:bg-gray-500',
    'border-sky-500',
    'text-sky-500',
    'hover:bg-sky-500',
    'border-violet-500',
    'text-violet-500',
    'hover:bg-violet-500',
    {
      pattern:
        /(bg|border)-(app)-(200|400|500|600)/,
      variants: ['hover']
    }
  ],
  theme: {
    extend: {
      screens: {
        xs: '350px',
        mld: '820px'
      },
      fontFamily: {
        gothica1: ['GothicA1', 'malgun gothic'],
        naverNeo: ['NaverNeo', 'malgun gothic']
      },
      minHeight: {
        '4/5': '80%'
      },
      colors: {
        app: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
