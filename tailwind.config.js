/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          light: '#DCF8C6',
        },
        secondary: {
          DEFAULT: '#34B7F1',
          dark: '#075E54',
        },
        dark: {
          DEFAULT: '#111B21',
          lighter: '#202C33',
          light: '#2A3942',
        },
        chat: {
          outgoing: '#DCF8C6',
          incoming: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      animation: {
        blob: 'blob 7s infinite',
        'scroll-down': 'scroll-down 1.5s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'float': 'float 10s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
          '33%': {
            transform: 'scale(1.1) translate(30px, -50px)',
          },
          '66%': {
            transform: 'scale(0.9) translate(-20px, 20px)',
          },
          '100%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
        },
        'scroll-down': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(6px)',
          },
        },
        'fadeIn': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'float': {
          '0%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '25%': {
            transform: 'translateY(-10px) translateX(10px)',
          },
          '50%': {
            transform: 'translateY(0px) translateX(20px)',
          },
          '75%': {
            transform: 'translateY(10px) translateX(10px)',
          },
          '100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
        },
      },
      dropShadow: {
        'glow': '0 0 15px rgba(37, 211, 102, 0.5)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 211, 102, 0.5)',
      },
    },
  },
  plugins: [],
}
