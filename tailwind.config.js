/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111318',
        paper: '#f7f6f3',
        amber: '#f0b429',
        'lab-bg': '#08090d',
        'lab-surface': '#141722',
        yellow: '#f0b429',
        steel: '#a8a6b0',
        'metal-dark': '#0e1016',
        metal: '#141722',
        'metal-light': '#1a1e2b',
      },
      fontFamily: {
        console: ['"JetBrains Mono"', 'SF Mono', 'Menlo', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lab: '16px',
      },
    },
  },
  plugins: [],
}
