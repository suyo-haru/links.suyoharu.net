import config from "../content/profile.json" with { type: "json" };
import { parseProfileConfig } from "./profile-config.ts";

// JSON は Vite のビルド時に取り込まれ、本番の表示内容として固定される。
export const profileConfig = parseProfileConfig(config);
