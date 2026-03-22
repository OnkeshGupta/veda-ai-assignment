import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'shimmer',
    'animate-fade-in',
    'animate-slide-up',
    'animate-spin',
    'animate-pulse-dot',
    'btn-primary',
    'btn-outline',
    'btn-sidebar-cta',
    'nav-item',
    'assignment-card',
    'form-input',
    'stepper-btn',
    'badge-easy',
    'badge-moderate',
    'badge-hard',
    'progress-track',
    'progress-fill',
    'sidebar',
    'topbar',
    'main-content',
    'desktop-layout',
    'mobile-layout',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      colors: {
        orange: { DEFAULT: '#E8500A', light: '#FCD8C4' },
        brand: { dark: '#181818' },
      },
    },
  },
  plugins: [],
};

export default config;