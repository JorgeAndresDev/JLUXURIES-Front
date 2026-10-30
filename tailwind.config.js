/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bfd3ff',
          300: '#93b4ff',
          400: '#5f8bff',
          500: '#1E6BFF',
          600: '#1557d6',
          700: '#1246ad',
          800: '#143d8a',
          900: '#16356f',
          950: '#0e2044',
        },
        surface: {
          light: '#ffffff',
          muted: '#f8fafc',
          dark: '#0f172a',
          raised: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -18px rgba(15, 23, 42, 0.18)',
        lift: '0 2px 4px rgba(15, 23, 42, 0.05), 0 20px 42px -24px rgba(15, 23, 42, 0.28)',
      },
      letterSpacing: {
        tighter: '-0.025em',
      },
    },
  },
  plugins: [],
}
