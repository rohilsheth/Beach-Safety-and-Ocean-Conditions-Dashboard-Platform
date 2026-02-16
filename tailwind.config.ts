import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        'flag-green': '#10b981',
        'flag-yellow': '#f59e0b',
        'flag-red': '#ef4444',
      },
    },
  },
  plugins: [],
}
export default config
