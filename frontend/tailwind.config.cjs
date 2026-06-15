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
        'primary-soft': '#818CF8',
        secondary: '#10B981',
        accent: '#F59E0B',
        warm: '#FF8A5B',
        'warm-dark': '#E8744A',
        teal: '#4ABDAC',
        ink: {
          950: '#0B0D12',
          900: '#11141B',
          800: '#171A23',
          700: '#1E222D',
          600: '#272B37',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        drift: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(40px, 50px) scale(1.06)' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' }
        },
        fillIn: {
          '0%': { opacity: '0', transform: 'scale(0.7)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out infinite 1.5s',
        drift: 'drift 16s ease-in-out infinite',
        'drift-reverse': 'drift 20s ease-in-out infinite reverse',
        rise: 'rise 0.6s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'fill-in': 'fillIn 0.45s ease forwards',
        'fill-bar': 'fillBar 1.2s ease-out 0.3s forwards',
        'fill-bar-slow': 'fillBar 1.4s ease-out 0.9s forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      }
    }
  },
  plugins: []
}