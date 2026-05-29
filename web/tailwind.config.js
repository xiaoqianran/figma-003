/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GODY 黄控台 (Industrial Archive) design tokens
        ink: '#0A0908',
        paper: '#F5F3ED',
        steel: '#B8B5B0',
        yellow: '#fecc2a',
        'metal-dark': '#11110F',
        'metal': '#1A1916',
        'metal-light': '#22211D',
      },
      fontFamily: {
        console: ['"IBM Plex Mono"', 'SF Mono', 'Menlo', 'monospace'],
        display: ['"Playfair Display"', 'Georgia', '"Songti SC"', 'serif'],
      }
    },
  },
  plugins: [],
}
