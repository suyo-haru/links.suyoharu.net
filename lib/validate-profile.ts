import config from "../content/profile.json" with { type: "json" };
import { parseProfileConfig } from "./profile-config.ts";

parseProfileConfig(config);
