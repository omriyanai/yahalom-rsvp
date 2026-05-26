/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'yahalom-red': '#C41230',
        'yahalom-gray': '#6B7280',
        'yahalom-dark': '#1F2937',
      },
    },
  },
  plugins: [],
}
