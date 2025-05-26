/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  safelist: [
    'text-amber-400',
    'text-red-400',
    'text-blue-400',
    'text-emerald-400',
    'text-violet-400',
    'text-purple-400',
    'text-cyan-400',
    'text-rose-950',
    'text-neutral-400',
  ],
  plugins: [],
};
