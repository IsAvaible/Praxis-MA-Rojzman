let primary = {
    // Indigo
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    // Emerald
    // 50:  '#ecfdf5',
    // 100: '#d1fae5',
    // 200: '#a7f3d0',
    // 300: '#6ee7b7',
    // 400: '#34d399',
    // 500: '#10b981',
    // 600: '#059669',
    // 700: '#047857',
    // 800: '#065f46',
    // 900: '#064e3b',
    // Lime
    // 50:  '#f7fee7',
    // 100: '#ecfccb',
    // 200: '#d9f99d',
    // 300: '#bef264',
    // 400: '#a3e635',
    // 500: '#84cc16',
    // 600: '#65a30d',
    // 700: '#4d7c0f',
    // 800: '#3f6212',
    // 900: '#365314',
};

module.exports = {
    mode: 'jit',
    darkMode: 'class',
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary': primary,
                transparent: 'transparent'
            },
            screens: {
                '4xl': '2048px',
                '5xl': '2304px'
            },
            animation: {
                'reverse-spin': 'reverse-spin 1s linear infinite'
            },
            keyframes: {
                "reverse-spin": {
                    from: {
                        transform: 'rotate(360deg)'
                    },
                }
            }
        },
    },
    plugins: [
        require("tailwind-heropatterns")({
            variants: [],
            patterns: ["leaf"],
            colors: {...primary, purple: '#6c50bd'},
            opacity: {
                default: "0.47",
            }
        }),
        require("tailwind-gradient-mask-image")
    ],
}
