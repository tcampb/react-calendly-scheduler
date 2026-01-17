import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLibrary = mode === "lib";

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isLibrary
        ? [
            dts({
              include: ["src/**/*.ts", "src/**/*.tsx"],
              exclude: ["src/main.tsx", "src/App.css"],
              tsconfigPath: "./tsconfig.lib.json",
              insertTypesEntry: true,
              copyDtsFiles: false,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    ...(isLibrary && {
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "CalendlyScheduler",
          formats: ["es", "cjs"],
          fileName: (format) =>
            `calendly-scheduler.${format === "es" ? "js" : "cjs"}`,
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === "style.css") return "styles.css";
              return assetInfo.name || "asset";
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
      },
    }),
  };
});
