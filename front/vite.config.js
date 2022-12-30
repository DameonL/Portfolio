import { defineConfig } from "vite";

export default defineConfig({
	root: "src/",
	appType: "custom",
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
	},
	build: {
		lib: {
			entry: "index.html",
			name: "Portfolio"
		},
		outDir: "../../deploy/wwwroot/",
    emptyOutDir: true,
		minify: "false",
		rollupOptions: {
			output: {
				entryFileNames: "index.js",
			},
		},
	},
	vite: {
		define: {
			"global": {},
		}
	}
});