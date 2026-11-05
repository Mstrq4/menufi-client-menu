/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                maroon: {
                    DEFAULT: '#800000',
                    light: '#991b1b',
                    dark: '#660000',
                },
                gold: {
                    DEFAULT: '#FFD700',
                    light: '#FFE44D',
                    dark: '#B39700',
                },
                dark: {
                    DEFAULT: '#0f1115',
                    900: '#0f1115',
                    800: '#181a20',
                    700: '#23262f',
                    600: '#2d323b',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
            },
            animation: {
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
