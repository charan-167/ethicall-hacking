/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e17',
          card: '#111827',
          panel: '#1e293b',
          border: '#334155',
          accent: '#06b6d4',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 70%), linear-gradient(rgba(15, 23, 42, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.8) 1px, transparent 1px)",
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'cyber-glow': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'cyber-danger': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
        'cyber-success': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}
