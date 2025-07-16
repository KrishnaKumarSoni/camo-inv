/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // PRD Design System: Black/white/purple color scheme
      colors: {
        primary: '#000000',     // Pure black for text and primary elements
        background: '#FFFFFF',  // Pure white backgrounds  
        accent: '#A855F7',      // Bright light purple for highlights and interactive elements
        'page-bg': '#FFF7ED',   // Very light shade of orange for page backgrounds
        gray: {
          light: '#F3F4F6',     // Light gray for subtle backgrounds
          medium: '#9CA3AF',    // Medium gray for secondary text
        }
      },
      // PRD Typography: DM Sans body font, Plus Jakarta Sans headings
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      // PRD Border radius: 12px for cards, 8px for buttons, 6px for inputs
      borderRadius: {
        'input': '6px',
        'button': '8px', 
        'card': '12px',
      },
      // PRD Mobile-first: max-width 414px centered on desktop
      maxWidth: {
        'mobile': '414px',
      },
      // PRD Touch targets: Minimum 44px height for all interactive elements
      minHeight: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}