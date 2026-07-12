/** @type {import('tailwindcss').Config} */
/** Tokens aligned with design-system/gody-studio/MASTER.md (ui-ux-pro-max) */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1C1917',
        secondary: '#44403C',
        cta: '#CA8A04',
        background: '#FAFAF9',
        ink: '#0C0A09',
        paper: '#FAFAF9',
        amber: '#CA8A04',
        yellow: '#CA8A04',
        'lab-bg': '#0C0A09',
        'lab-surface': '#1C1917',
        steel: '#A8A29E',
        'metal-dark': '#1C1917',
        metal: '#1C1917',
        'metal-light': '#44403C',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        console: ['"JetBrains Mono"', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lab: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
