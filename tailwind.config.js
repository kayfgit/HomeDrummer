/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#1a1a2e",
                secondary: "#16213e",
                accent: "#e94560",
                surface: "#0f0f23",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
            },
        },
    },
    plugins: [],
};
