/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e8f2',
          200: '#c3d2e5',
          300: '#95b1d3',
          400: '#608ab9',
          500: '#3c699c',
          600: '#2b507f',
          700: '#234168',
          800: '#1b3252',
          900: '#0f172a',
          950: '#070b14',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
