import path from "path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import autoprefixer from "autoprefixer"
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

	base: '/cosmos/',
	css: {
		postcss: {
			plugins: [
				autoprefixer()
			],
		},
	},
	optimizeDeps: {
		include: ['vue', 'vue-router', 'pinia'], // Укажите основные зависимости
	},
	plugins: [
		vue(),
		tailwindcss(),
		// visualizer({
		// 	open: true, // Открывает отчет в браузере после сборки
		// }),
	],
	test: {
		globals: true,
		include: ['src/**/*.test.{js,ts,vue}'],
    environment: 'jsdom',
  },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Удаляет console.log из финальной сборки

			},
		},
		rollupOptions: {
			external: ['ModuleRegistry'],
			output: {
				globals: {
					ModuleRegistry: 'ModuleRegistry',
				},
				dir: 'dist/',
				entryFileNames: 'plugin.js',
				assetFileNames: 'plugin-[name][extname]',
				manualChunks: undefined,
				exports: 'none'
			}
		}
	}
})
