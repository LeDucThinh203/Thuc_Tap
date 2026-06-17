/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // Tailwind dark mode via .dark class on <html>
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // ── Primary (blue-600 based) ──────────────────────────
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',   // ← Brand primary
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // ── Semantic status ───────────────────────────────────
        success: '#10B981',   // emerald-500
        warning: '#F59E0B',   // amber-500
        danger:  '#EF4444',   // red-500

        // ── Surface / background ──────────────────────────────
        surface: {
          50:  '#F8FAFC',   // page bg (light)
          100: '#F1F5F9',
          200: '#E2E8F0',   // border
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',   // sidebar bg / page bg (dark)
          950: '#080D18',
        },

        // ── Parking slot status ───────────────────────────────
        slot: {
          available: '#10B981',
          occupied:  '#EF4444',
          reserved:  '#F59E0B',
          disabled:  '#94A3B8',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },

      spacing: {
        sidebar:   '240px',
        'sidebar-sm': '72px',
        topbar:    '64px',
      },

      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        panel:  '0 4px 12px rgba(0,0,0,.08)',
        sidebar:'4px 0 20px rgba(0,0,0,.12)',
        glow:   '0 0 20px -4px rgba(37,99,235,.45)',
        topbar: '0 1px 3px rgba(0,0,0,.06)',
      },

      borderRadius: {
        card: '12px',
        btn:  '8px',
        xl:   '1rem',
        '2xl':'1.25rem',
      },

      transitionDuration: {
        base: '220ms',
        slow: '350ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },

      animation: {
        'fade-in':   'fadeIn .22s cubic-bezier(0.4,0,0.2,1) both',
        'slide-left':'slideLeft .22s cubic-bezier(0.4,0,0.2,1) both',
        'slide-up':  'slideUp .22s cubic-bezier(0.4,0,0.2,1) both',
        'shimmer':   'shimmer 1.5s infinite',
        'spin-slow': 'spin 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },

  plugins: [],
};
