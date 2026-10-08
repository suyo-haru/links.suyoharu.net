import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // @ts-ignore freshがなぜかviteのpluginの型定義に合わない 実害はない
    fresh(),
    tailwindcss(),
  ],
});
