import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  appType: "custom",
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h } from "preact"`,
  },
  build: {
    lib: {
      entry: "index.html",
      name: "Portfolio",
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
      global: {},
    },
  },
});
