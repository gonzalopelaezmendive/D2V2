/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tipografía optimizada para dislexia
      fontFamily: {
        sans: ['OpenDyslexic', 'Comic Sans MS', 'Arial', 'sans-serif'],
      },
      // Espaciados generosos
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      // Colores con alto contraste
      colors: {
        'd2v2-primary': '#4A90E2',
        'd2v2-secondary': '#7B68EE',
        'd2v2-success': '#50C878',
        'd2v2-warning': '#FFB84D',
        'd2v2-error': '#FF6B6B',
        'd2v2-neutral-50': '#FAFAFA',
        'd2v2-neutral-100': '#F5F5F5',
        'd2v2-neutral-200': '#E5E5E5',
        'd2v2-neutral-300': '#D4D4D4',
        'd2v2-neutral-600': '#525252',
        'd2v2-neutral-700': '#404040',
        'd2v2-neutral-800': '#262626',
        'd2v2-neutral-900': '#171717',
      },
      // Tamaños de texto más grandes
      fontSize: {
        'base': '1.125rem', // 18px por defecto
        'lg': '1.25rem',    // 20px
        'xl': '1.5rem',     // 24px
      },
      // Line height generoso
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
