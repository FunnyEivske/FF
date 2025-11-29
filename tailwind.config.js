/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    900: '#1a472a',
                    800: '#235c38',
                    700: '#2d7045',
                },
                rust: {
                    500: '#b87333',
                    600: '#a0622b',
                },
                myr: {
                    500: '#5d4037',
                    purple: '#9d4edd',
                },
                charcoal: {
                    900: '#121212',
                    800: '#1e1e1e',
                    700: '#2a2a2a',
                },
                parchment: '#e0e0e0',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
