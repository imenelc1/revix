/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#10B981',
        accent: '#F59E0B'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 1.5s',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'fill-bar': 'fillBar 1.2s ease-out 0.3s forwards',
        'fill-bar-slow': 'fillBar 1.5s ease-out 0.6s forwards'
      }
    }
  },
  plugins: []
}
