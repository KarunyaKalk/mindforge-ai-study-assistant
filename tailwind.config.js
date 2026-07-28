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
        sans: ['Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      colors: {
        // Linear/Vercel Exact Dark Theme Palette
        canvas: {
          dark: '#090B11',
          light: '#f8fafc',
        },
        sub: {
          dark: '#111827',
          light: '#f1f5f9',
        },
        card: {
          dark: '#161B26',
          light: '#ffffff',
        },
        accent: {
          DEFAULT: '#F4C430',
          hover: '#E5B826',
          light: 'rgba(244, 196, 48, 0.12)',
        },
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'card': '16px',
      }
    },
  },
  plugins: [],
}
