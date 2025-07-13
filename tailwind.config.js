// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte,ts,js}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: []
};
