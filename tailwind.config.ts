import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: '#050505',
        surface: '#0B0B0B',
        'surface-2': '#111111',
        'surface-3': '#1A1A1A',
        'border-strong': '#4A391C',
        'text-primary': '#F8F5EC',
        'text-secondary': '#B8B2A3',
        'text-muted': '#6F6A60',
        accent: '#D4AF37',
        'accent-mid': '#B88924',
        'accent-dark': '#6E4F12',
        'accent-deep': '#6E4F12',
        'gray-text': '#B8B2A3',
        'gray-border': 'rgba(74,57,28,0.20)',
        star: '#D4AF37',
        error: '#BA1A1A',
        border: "#2A2418",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold-primary))",
          dark: "hsl(var(--gold-dark))",
        },
        "surface-low": "hsl(var(--surface-low))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        'card': `
          0 1px 3px rgba(0,0,0,0.28),
          0 4px 16px rgba(0,0,0,0.55),
          0 16px 40px rgba(0,0,0,0.45)
        `,
        'card-hover': `
          0 2px 8px rgba(0,0,0,0.35),
          0 8px 32px rgba(0,0,0,0.65),
          0 24px 56px rgba(0,0,0,0.55),
          0 0 0 1px rgba(212,175,55,0.20)
        `,
        'gold-glow': `
          0 0 0 1px rgba(212,175,55,0.35),
          0 8px 32px rgba(212,175,55,0.18),
          0 24px 64px rgba(110,79,18,0.22)
        `,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

