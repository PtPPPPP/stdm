/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8eccff',
          400: '#59b0ff',
          500: '#338eff',
          600: '#1c6ef5',
          700: '#1558e1',
          800: '#1747b6',
          900: '#193e8f',
          950: '#142757',
        },
        track: {
          gold: '#D4AF37',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          sprint: '#FF6B6B',
          distance: '#4ECDC4',
          hurdle: '#FFD93D',
          jump: '#6C5CE7',
          throw: '#FF8A5C',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans SC',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'Inter',
          'Noto Sans SC',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'hero-pattern':
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'card-gradient':
          'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.95) 100%)',
      },
    },
  },
  plugins: [],
};
