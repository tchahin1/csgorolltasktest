/** @type {import('tailwindcss').Config} */

const path = require('path');

module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'temp-bg': "url('../assets/temp-bg.png')",
        login: "url('../assets/hero_image.svg')",
        'tennis-court': "url('../assets/tennis-court.svg')",
        'player-bounces': "url('../assets/player-bounces.svg')",
        'player-hit-points': "url('../assets/player-hit-points.svg')",
        'player-return-hit': "url('../assets/player-return-hit.svg')",
        'player-return-bounces': "url('../assets/player-return-bounces.svg')",
      },
      colors: {
        'primary-100': '#E4F1C1',
        'primary-300': '#C8E283',
        'primary-400': '#B6D95A',
        'primary-500': '#A4CF31',
        'primary-600': '#83A627',
        'primary-800': '#425314',
      },
      animation: {
        bounce: 'bounce 0.7s linear infinite',
        fadeIn: 'fadeIn 0.5s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
    },
    screens: {
      xs: { max: '639px' },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/container-queries'),
  ],
  presets: [require('../../tailwind-workspace-preset.js')],
  purge: [
    path.join(__dirname, '../../libs/ui-library/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, './app/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, './node_modules/flowbite/**/*.js'),
    path.join(__dirname, './node_modules/flowbite-react/**/*.js'),
  ],
  mode: 'jit',
};
