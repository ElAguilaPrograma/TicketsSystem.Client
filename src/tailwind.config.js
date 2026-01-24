/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: 'var(--color-primary)',
                    secondary: 'var(--color-secondary)',
                    bg: 'var(--background)',
                    text: 'var(--text-main)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    },
    plugins: [],
}