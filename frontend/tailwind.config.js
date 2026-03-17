/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                        heading: ['Fraunces', 'Playfair Display', 'serif'],
                        body: ['Manrope', 'Plus Jakarta Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: '#F7F5F0',
                        foreground: '#1A1A1A',
                        card: {
                                DEFAULT: '#FFFFFF',
                                foreground: '#1A1A1A'
                        },
                        popover: {
                                DEFAULT: '#FFFFFF',
                                foreground: '#1A1A1A'
                        },
                        primary: {
                                DEFAULT: '#2D5A27',
                                foreground: '#FFFFFF',
                                50: '#F2F7F2',
                                100: '#E0EBE0',
                                200: '#C2D6C2',
                                300: '#8FBC8F',
                                400: '#5E8C5E',
                                500: '#2D5A27',
                                600: '#22451E',
                                700: '#193316',
                                800: '#11220F',
                                900: '#0A1409'
                        },
                        secondary: {
                                DEFAULT: '#E8E4D9',
                                foreground: '#2D5A27',
                                50: '#FBFAF8',
                                100: '#F7F5F0',
                                200: '#E8E4D9',
                                300: '#D3CCBA',
                                400: '#BDB39B',
                                500: '#9C8F73'
                        },
                        muted: {
                                DEFAULT: '#F0F2F0',
                                foreground: '#5C6B5C'
                        },
                        accent: {
                                DEFAULT: '#D97757',
                                foreground: '#FFFFFF'
                        },
                        destructive: {
                                DEFAULT: '#DC2626',
                                foreground: '#FFFFFF'
                        },
                        border: '#E2E8E2',
                        input: '#E2E8E2',
                        ring: '#2D5A27',
                        chart: {
                                '1': '#2D5A27',
                                '2': '#8FBC8F',
                                '3': '#D97757',
                                '4': '#E8E4D9',
                                '5': '#5C6B5C'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
