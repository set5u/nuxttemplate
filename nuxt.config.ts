import replacer from "./plugin-vite/replaceResolveComponent";
import obfuscator from "vite-plugin-javascript-obfuscator";
import surrounder from "./plugin-vite/surroundResolveComponent";

import vuePlugin from "@vitejs/plugin-vue";
import swc from "unplugin-swc";
const reservedStrings: string[] = [];
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  $production: {
    vite: {
      plugins: [
        swc.rollup({
          // @ts-ignore
          exclude: [/core-js/],
          tsconfigFile: false,
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
          env: {
            coreJs: "3.38.1",
            mode: "usage",
            forceAllTransforms: true,
          },
        }),
        replacer(reservedStrings),
        obfuscator({
          options: {
            optionsPreset: "high-obfuscation",
            disableConsoleOutput: false,
            deadCodeInjection: false,
            reservedStrings,
          },
          apply: "build",
        }),
        surrounder(),
      ],
      optimizeDeps: {
        esbuildOptions: {
          loader: {
            ".node": "file",
          },
        },
      },
      worker: {
        format: "es",
        plugins: () => [
          vuePlugin(),
          swc.rollup({
            // @ts-ignore
            exclude: [/core-js/],
            tsconfigFile: false,
            jsc: {
              parser: {
                syntax: "typescript",
              },
            },
            env: {
              coreJs: "3.38.1",
              mode: "usage",
              forceAllTransforms: true,
            },
          }),
          replacer(reservedStrings),
          obfuscator({
            options: {
              optionsPreset: "high-obfuscation",
              disableConsoleOutput: false,
              deadCodeInjection: false,
              reservedStrings,
            },
            apply: "build",
          }),
          surrounder(),
        ],
      },
    },
  },
  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss"],
});
