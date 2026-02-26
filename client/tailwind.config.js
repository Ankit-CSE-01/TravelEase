/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                space: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                primary: "#3B82F6",
                secondary: "#10B981",
                emergency: "#EF4444",
                dark: {
                    base: "#0f172a", // slate-900
                    surface: "#1e293b", // slate-800
                    border: "#334155" // slate-700
                }
            },
        },
    },
    plugins: [],
}

