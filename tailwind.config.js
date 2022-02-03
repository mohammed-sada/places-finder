module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D2926FF',
        secondary: '#E94B3CFF',
        whiteVar: '#fff',
        blackVar: '#000'
      },
      backgroundImage: {
        'home-bg': "url('/static/black.png')",
      }
    },
  },
  plugins: [],
};
